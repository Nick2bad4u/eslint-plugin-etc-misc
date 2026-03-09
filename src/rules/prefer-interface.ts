import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";
import type * as ts from "typescript";

import { ruleCreator } from "../_internal/rule-creator.js";
import {
    createReplacementRuleInfo,
    withDeprecatedRuleLifecycle,
} from "../_internal/rule-deprecation.js";

type MessageIds = "forbidden" | "suggest";

type Options = readonly [RuleOptions?];

type RuleOptions = Readonly<{
    allowIntersection?: boolean;
    allowLocal?: boolean;
}>;

type TypedParserServices = TSESLint.SourceCode["parserServices"] & {
    readonly esTreeNodeToTSNodeMap: Readonly<
        WeakMap<Readonly<es.Node>, ts.Node>
    >;
    readonly program: ts.Program;
};

const defaultOptions: Options = [{}];

const hasTypedParserServices = (
    parserServices: Readonly<TSESLint.SourceCode["parserServices"]> | undefined
): parserServices is TypedParserServices =>
    parserServices !== undefined &&
    "esTreeNodeToTSNodeMap" in parserServices &&
    "program" in parserServices;

const isExportedTypeAlias = (
    typeAliasDeclaration: Readonly<es.TSTypeAliasDeclaration>
): boolean =>
    typeAliasDeclaration.parent?.type === "ExportNamedDeclaration" &&
    typeAliasDeclaration.parent.declaration === typeAliasDeclaration;

const getTypeAliasDeclarationParent = (
    node: Readonly<es.Node> | undefined
): Readonly<es.TSTypeAliasDeclaration> | undefined =>
    node?.type === "TSTypeAliasDeclaration" ? node : undefined;

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
    const parametersText = functionTypeNode.params
        .map((parameter) => sourceCode.getText(parameter))
        .join(", ");
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
    const baseTypesText = referenceNodes
        .map((referenceNode) => sourceCode.getText(referenceNode))
        .join(", ");
    const extendsClause =
        baseTypesText.length > 0 ? ` extends ${baseTypesText}` : "";
    const bodyText =
        literalNode === undefined ? "{}" : sourceCode.getText(literalNode);

    return `interface ${typeAliasDeclaration.id.name}${aliasTypeParameters}${extendsClause} ${bodyText}`;
};

const canSafelyConvertIntersection = (
    intersectionTypeNode: Readonly<es.TSIntersectionType>,
    parserServices: Readonly<TypedParserServices>,
    typeChecker: Readonly<ts.TypeChecker>
):
    | undefined
    | {
          readonly literals: readonly Readonly<es.TSTypeLiteral>[];
          readonly references: readonly Readonly<es.TSTypeReference>[];
      } => {
    const literals: es.TSTypeLiteral[] = [];
    const references: es.TSTypeReference[] = [];

    for (const intersectionMember of intersectionTypeNode.types) {
        if (intersectionMember.type === "TSTypeLiteral") {
            literals.push(intersectionMember);
            continue;
        }

        if (intersectionMember.type === "TSTypeReference") {
            references.push(intersectionMember);
            continue;
        }

        return undefined;
    }

    if (literals.length > 1) {
        return undefined;
    }

    for (const reference of references) {
        const tsNode = parserServices.esTreeNodeToTSNodeMap.get(reference);
        if (tsNode === undefined) {
            return undefined;
        }

        const referenceType = typeChecker.getTypeAtLocation(tsNode);
        if (referenceType.isUnion()) {
            return undefined;
        }
    }

    return {
        literals,
        references,
    };
};

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
        const parserServices = sourceCode.parserServices;
        const typeChecker = hasTypedParserServices(parserServices)
            ? parserServices.program.getTypeChecker()
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
                if (allowIntersection || typeChecker === undefined) {
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

                if (!hasTypedParserServices(parserServices)) {
                    return;
                }

                const conversion = canSafelyConvertIntersection(
                    intersectionTypeNode,
                    parserServices,
                    typeChecker
                );
                if (conversion === undefined) {
                    return;
                }

                reportTypeAlias(
                    context,
                    typeAliasDeclaration,
                    createIntersectionFixText(
                        sourceCode,
                        typeAliasDeclaration,
                        conversion.literals[0],
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
        docs: {
            description:
                "disallow equivalent type aliases when an interface declaration can be used.",
            recommended: false,
            suggestion: true,
            url: "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/prefer-interface.md",
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
