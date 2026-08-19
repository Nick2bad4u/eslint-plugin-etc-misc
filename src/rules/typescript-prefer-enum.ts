import {
    getConstrainedTypeAtLocation,
    isTypeFlagSet,
} from "@typescript-eslint/type-utils";
import {
    AST_NODE_TYPES,
    type TSESTree as es,
    ESLintUtils,
} from "@typescript-eslint/utils";
import { arrayFirst, isDefined } from "ts-extras";
import * as tsutils from "tsutils";
import ts from "typescript";

import { ruleCreator } from "../_internal/rule-creator.js";
import { withDeprecatedRuleLifecycle } from "../_internal/rule-deprecation.js";

type MessageIds =
    | "preferEnumComparison"
    | "preferEnumReturn"
    | "preferEnumUnion";

type Options = readonly [];

const isEnumLikeOrUndefinedType = (
    checker: Readonly<ts.TypeChecker>,
    type: Readonly<ts.Type>
): boolean => {
    let hasEnumLike = false;

    for (const typeVariant of tsutils.unionTypeParts(type)) {
        const apparentType = checker.getApparentType(typeVariant);

        if (isTypeFlagSet(typeVariant, ts.TypeFlags.Undefined)) {
            // Undefined is permitted alongside an otherwise enum-like type.
        } else if (
            isTypeFlagSet(typeVariant, ts.TypeFlags.EnumLike) ||
            isTypeFlagSet(apparentType, ts.TypeFlags.EnumLike)
        ) {
            hasEnumLike = true;
        } else {
            return false;
        }
    }

    return hasEnumLike;
};

const isStringLiteral = (node: Readonly<es.Node>): node is es.Literal =>
    node.type === AST_NODE_TYPES.Literal && typeof node.value === "string";

/**
 * Prefer enums over string literal comparisons and unions.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => {
        const parserServices = ESLintUtils.getParserServices(context);
        const checker = parserServices.program.getTypeChecker();

        return {
            BinaryExpression: (node: Readonly<es.BinaryExpression>): void => {
                const isEqualityOperator =
                    node.operator === "==" ||
                    node.operator === "===" ||
                    node.operator === "!=" ||
                    node.operator === "!==";
                if (!isEqualityOperator) {
                    return;
                }

                const literalNode = isStringLiteral(node.left)
                    ? node.left
                    : isStringLiteral(node.right)
                      ? node.right
                      : null;
                if (literalNode === null) {
                    return;
                }
                const expressionNode =
                    literalNode === node.left ? node.right : node.left;

                const expressionType = getConstrainedTypeAtLocation(
                    parserServices,
                    expressionNode
                );
                if (!isEnumLikeOrUndefinedType(checker, expressionType)) {
                    return;
                }

                context.report({
                    messageId: "preferEnumComparison",
                    node: literalNode,
                });
            },
            ReturnStatement: (node: Readonly<es.ReturnStatement>): void => {
                if (node.argument === null || !isStringLiteral(node.argument)) {
                    return;
                }

                let functionNode:
                    | es.ArrowFunctionExpression
                    | es.FunctionDeclaration
                    | es.FunctionExpression
                    | null = null;
                for (const ancestor of context.sourceCode.getAncestors(node)) {
                    if (
                        ancestor.type ===
                            AST_NODE_TYPES.ArrowFunctionExpression ||
                        ancestor.type === AST_NODE_TYPES.FunctionDeclaration ||
                        ancestor.type === AST_NODE_TYPES.FunctionExpression
                    ) {
                        functionNode = ancestor;
                    }
                }
                if (functionNode === null) {
                    return;
                }

                const signature = arrayFirst(
                    getConstrainedTypeAtLocation(
                        parserServices,
                        functionNode
                    ).getCallSignatures()
                );
                const returnType = isDefined(signature)
                    ? checker.getReturnTypeOfSignature(signature)
                    : undefined;
                if (!isDefined(returnType)) {
                    return;
                }

                if (!isEnumLikeOrUndefinedType(checker, returnType)) {
                    return;
                }

                context.report({
                    messageId: "preferEnumReturn",
                    node: node.argument,
                });
            },
            TSTypeAliasDeclaration: (
                node: Readonly<es.TSTypeAliasDeclaration>
            ): void => {
                if (node.typeAnnotation.type !== AST_NODE_TYPES.TSUnionType) {
                    return;
                }

                let literalCount = 0;
                for (const typeNode of node.typeAnnotation.types) {
                    if (
                        typeNode.type === AST_NODE_TYPES.TSLiteralType &&
                        typeNode.literal.type === AST_NODE_TYPES.Literal &&
                        typeof typeNode.literal.value === "string"
                    ) {
                        literalCount += 1;
                    }
                }
                if (
                    literalCount > 1 &&
                    literalCount === node.typeAnnotation.types.length
                ) {
                    context.report({
                        messageId: "preferEnumUnion",
                        node,
                    });
                }
            },
        };
    },
    meta: {
        deprecated: false,
        docs: {
            deprecated: false,
            description:
                "enforce enums over string literal comparisons and pure string unions.",
            frozen: false,
            recommended: false,
            requiresTypeChecking: true,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-prefer-enum",
        },
        hasSuggestions: false,
        languages: ["js/js"],
        messages: {
            preferEnumComparison:
                "Use enum members instead of string literals in enum comparisons.",
            preferEnumReturn:
                "Return enum members instead of string literals from enum-returning functions.",
            preferEnumUnion:
                "Prefer an enum declaration instead of a pure string-literal union type.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "typescript/prefer-enum",
});

/** Deprecated rule with explicit lifecycle metadata. */
const deprecatedRule: typeof rule = withDeprecatedRuleLifecycle(rule, {
    availableUntil: "4.0.0",
    deprecatedSince: "3.0.0",
    message:
        "Deprecated without replacement because requiring enums conflicts with this plugin's no-enum policy.",
    ruleId: "typescript/prefer-enum",
});

export default deprecatedRule;
