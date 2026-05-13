import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

import { getConstrainedTypeAtLocation } from "@typescript-eslint/type-utils";
import { AST_NODE_TYPES, ESLintUtils } from "@typescript-eslint/utils";
import { arrayFirst, arrayJoin, isDefined } from "ts-extras";
import * as tsutils from "tsutils";

import { ruleCreator } from "../_internal/rule-creator.js";
import {
    createReplacementRuleInfo,
    withDeprecatedRuleLifecycle,
} from "../_internal/rule-deprecation.js";

type MessageIds = "forbidden" | "suggest";

type Options = readonly [RuleOptions?];

type RuleOptions = Readonly<{
    readonly allowIntersection?: boolean;
    readonly allowLocal?: boolean;
}>;

const defaultOptions: Options = [{}];

const isExportedTypeAlias = (
    typeAliasDeclaration: Readonly<es.TSTypeAliasDeclaration>
): boolean =>
    typeAliasDeclaration.parent.type ===
        AST_NODE_TYPES.ExportNamedDeclaration &&
    typeAliasDeclaration.parent.declaration === typeAliasDeclaration;

const getTypeAliasDeclarationParent = (
    node: Readonly<es.Node> | undefined
): Readonly<es.TSTypeAliasDeclaration> | undefined =>
    node?.type === AST_NODE_TYPES.TSTypeAliasDeclaration ? node : undefined;

const formatTypeParameters = (
    sourceCode: Readonly<TSESLint.SourceCode>,
    typeParameters:
        | Readonly<es.TSTypeParameterDeclaration>
        | Readonly<es.TSTypeParameterInstantiation>
        | undefined
): string =>
    typeParameters === undefined ? "" : sourceCode.getText(typeParameters);

const createTypeLiteralFixText = (
    sourceCode: Readonly<TSESLint.SourceCode>,
    typeAliasDeclaration: Readonly<es.TSTypeAliasDeclaration>,
    typeLiteralNode: Readonly<es.TSTypeLiteral>
): string => {
    const aliasTypeParameters = formatTypeParameters(
        sourceCode,
        typeAliasDeclaration.typeParameters
    );
    const literalText = sourceCode.getText(typeLiteralNode);

    return `interface ${typeAliasDeclaration.id.name}${aliasTypeParameters} ${literalText}`;
};

const createFunctionTypeFixText = (
    sourceCode: Readonly<TSESLint.SourceCode>,
    typeAliasDeclaration: Readonly<es.TSTypeAliasDeclaration>,
    functionTypeNode: Readonly<es.TSFunctionType>
): string => {
    const aliasTypeParameters = formatTypeParameters(
        sourceCode,
        typeAliasDeclaration.typeParameters
    );
    const functionTypeParameters = formatTypeParameters(
        sourceCode,
        functionTypeNode.typeParameters
    );
    const parametersText = arrayJoin(
        functionTypeNode.params.map((parameter) =>
            sourceCode.getText(parameter)
        ),
        ", "
    );
    const returnTypeText =
        functionTypeNode.returnType === undefined
            ? "void"
            : sourceCode.getText(functionTypeNode.returnType.typeAnnotation);

    return `interface ${typeAliasDeclaration.id.name}${aliasTypeParameters} { ${functionTypeParameters}(${parametersText}): ${returnTypeText}; }`;
};

const createIntersectionFixText = (
    sourceCode: Readonly<TSESLint.SourceCode>,
    typeAliasDeclaration: Readonly<es.TSTypeAliasDeclaration>,
    literalNode: Readonly<es.TSTypeLiteral> | undefined,
    referenceNodes: readonly Readonly<es.TSTypeReference>[]
): string => {
    const aliasTypeParameters = formatTypeParameters(
        sourceCode,
        typeAliasDeclaration.typeParameters
    );
    const baseTypesText = arrayJoin(
        referenceNodes.map((referenceNode) =>
            sourceCode.getText(referenceNode)
        ),
        ", "
    );
    const extendsClause =
        baseTypesText.length > 0 ? ` extends ${baseTypesText}` : "";
    const bodyText =
        literalNode === undefined ? "{}" : sourceCode.getText(literalNode);

    return `interface ${typeAliasDeclaration.id.name}${aliasTypeParameters}${extendsClause} ${bodyText}`;
};

const canSafelyConvertIntersection = (
    intersectionTypeNode: Readonly<es.TSIntersectionType>,
    parserServices: Readonly<Parameters<typeof getConstrainedTypeAtLocation>[0]>
):
    | undefined
    | {
          readonly literals: readonly Readonly<es.TSTypeLiteral>[];
          readonly references: readonly Readonly<es.TSTypeReference>[];
      } => {
    let literals: readonly es.TSTypeLiteral[] = [];
    let references: readonly es.TSTypeReference[] = [];

    for (const intersectionMember of intersectionTypeNode.types) {
        if (intersectionMember.type === AST_NODE_TYPES.TSTypeLiteral) {
            literals = [...literals, intersectionMember];
            continue;
        }

        if (intersectionMember.type === AST_NODE_TYPES.TSTypeReference) {
            references = [...references, intersectionMember];
            continue;
        }

        return undefined;
    }

    if (literals.length > 1) {
        return undefined;
    }

    for (const reference of references) {
        const referenceType = getConstrainedTypeAtLocation(
            parserServices,
            reference
        );
        if (tsutils.unionTypeParts(referenceType).length > 1) {
            return undefined;
        }
    }

    return {
        literals,
        references,
    };
};

const hasFullTypeInformation = (
    parserServices: Readonly<ReturnType<typeof ESLintUtils.getParserServices>>
): parserServices is Parameters<typeof getConstrainedTypeAtLocation>[0] =>
    parserServices.program !== null;

const reportTypeAlias = (
    context: Readonly<TSESLint.RuleContext<MessageIds, Options>>,
    typeAliasDeclaration: Readonly<es.TSTypeAliasDeclaration>,
    replacementText: string
): void => {
    const fix: TSESLint.ReportFixFunction = (fixer) =>
        fixer.replaceText(typeAliasDeclaration, replacementText);

    context.report({
        fix,
        messageId: "forbidden",
        node: typeAliasDeclaration.id,
        suggest: [
            {
                fix,
                messageId: "suggest",
            },
        ],
    });
};

/**
 * Prefer interface declarations when a type alias can be represented safely.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => {
        const [{ allowIntersection = true, allowLocal = false } = {}] =
            context.options;
        const sourceCode = context.sourceCode;
        const parserServices = ESLintUtils.getParserServices(context, true);
        const typedParserServices = hasFullTypeInformation(parserServices)
            ? parserServices
            : undefined;

        const shouldSkipForAllowLocal = (
            typeAliasDeclaration: Readonly<es.TSTypeAliasDeclaration>
        ): boolean => allowLocal && !isExportedTypeAlias(typeAliasDeclaration);

        return {
            "TSTypeAliasDeclaration > TSFunctionType": (
                functionTypeNode: Readonly<es.TSFunctionType>
            ) => {
                const typeAliasDeclaration = getTypeAliasDeclarationParent(
                    functionTypeNode.parent
                );
                if (typeAliasDeclaration === undefined) {
                    return;
                }

                if (shouldSkipForAllowLocal(typeAliasDeclaration)) {
                    return;
                }

                reportTypeAlias(
                    context,
                    typeAliasDeclaration,
                    createFunctionTypeFixText(
                        sourceCode,
                        typeAliasDeclaration,
                        functionTypeNode
                    )
                );
            },
            "TSTypeAliasDeclaration > TSIntersectionType": (
                intersectionTypeNode: Readonly<es.TSIntersectionType>
            ) => {
                if (allowIntersection || typedParserServices === undefined) {
                    return;
                }

                const typeAliasDeclaration = getTypeAliasDeclarationParent(
                    intersectionTypeNode.parent
                );
                if (typeAliasDeclaration === undefined) {
                    return;
                }

                if (shouldSkipForAllowLocal(typeAliasDeclaration)) {
                    return;
                }

                const conversion = canSafelyConvertIntersection(
                    intersectionTypeNode,
                    typedParserServices
                );
                if (!isDefined(conversion)) {
                    return;
                }

                reportTypeAlias(
                    context,
                    typeAliasDeclaration,
                    createIntersectionFixText(
                        sourceCode,
                        typeAliasDeclaration,
                        arrayFirst(conversion.literals),
                        conversion.references
                    )
                );
            },
            "TSTypeAliasDeclaration > TSTypeLiteral": (
                typeLiteralNode: Readonly<es.TSTypeLiteral>
            ) => {
                const typeAliasDeclaration = getTypeAliasDeclarationParent(
                    typeLiteralNode.parent
                );
                if (typeAliasDeclaration === undefined) {
                    return;
                }

                if (shouldSkipForAllowLocal(typeAliasDeclaration)) {
                    return;
                }

                reportTypeAlias(
                    context,
                    typeAliasDeclaration,
                    createTypeLiteralFixText(
                        sourceCode,
                        typeAliasDeclaration,
                        typeLiteralNode
                    )
                );
            },
        };
    },
    defaultOptions,
    meta: {
        defaultOptions: [{}],
        deprecated: true,
        docs: {
            deprecated: true,
            description:
                "disallow equivalent type aliases when an interface declaration can be used.",
            frozen: true,
            recommended: false,
            suggestion: true,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/prefer-interface",
        },
        fixable: "code",
        hasSuggestions: true,
        messages: {
            forbidden: "Type alias can be declared using an interface.",
            suggest: "Use an interface instead of a type alias.",
        },
        schema: [
            {
                additionalProperties: false,
                description:
                    "Options for allowing local aliases and intersection aliases.",
                properties: {
                    allowIntersection: {
                        description:
                            "Whether type aliases that use intersections are allowed.",
                        type: "boolean",
                    },
                    allowLocal: {
                        description:
                            "Whether non-exported type aliases are allowed.",
                        type: "boolean",
                    },
                },
                type: "object",
            },
        ],
        type: "suggestion",
    },
    name: "prefer-interface",
});

/**
 * Wrapper rule with explicit lifecycle metadata and replacement mapping.
 */
const deprecatedRule: typeof rule = withDeprecatedRuleLifecycle(rule, {
    message:
        "Deprecated in favor of @typescript-eslint/consistent-type-definitions.",
    replacedBy: [
        createReplacementRuleInfo({
            plugin: {
                name: "@typescript-eslint",
                url: "https://typescript-eslint.io/",
            },
            rule: {
                name: "consistent-type-definitions",
                url: "https://typescript-eslint.io/rules/consistent-type-definitions",
            },
        }),
    ],
    ruleId: "prefer-interface",
});

export default deprecatedRule;
