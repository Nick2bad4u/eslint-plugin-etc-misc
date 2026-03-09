import { type TSESTree as es, ESLintUtils } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";
import { isEnumLikeOrUndefinedType } from "../_internal/typescript-type-utils.js";

type MessageIds =
    | "preferEnumComparison"
    | "preferEnumReturn"
    | "preferEnumUnion";

type Options = readonly [];

const isStringLiteral = (node: Readonly<es.Node>): node is es.Literal =>
    node.type === "Literal" && typeof node.value === "string";

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
                      : undefined;
                const expressionNode =
                    literalNode === node.left ? node.right : node.left;
                if (literalNode === undefined) {
                    return;
                }

                const tsNode =
                    parserServices.esTreeNodeToTSNodeMap.get(expressionNode);
                const expressionType = checker.getTypeAtLocation(tsNode);
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
                    | undefined = undefined;
                for (const ancestor of context.sourceCode.getAncestors(node)) {
                    if (
                        ancestor.type === "ArrowFunctionExpression" ||
                        ancestor.type === "FunctionDeclaration" ||
                        ancestor.type === "FunctionExpression"
                    ) {
                        functionNode = ancestor;
                    }
                }
                if (functionNode === undefined) {
                    return;
                }

                const tsNode =
                    parserServices.esTreeNodeToTSNodeMap.get(functionNode);
                const signature = checker
                    .getTypeAtLocation(tsNode)
                    .getCallSignatures()[0];
                const returnType =
                    signature === undefined
                        ? undefined
                        : checker.getReturnTypeOfSignature(signature);
                if (returnType === undefined) {
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
                if (node.typeAnnotation.type !== "TSUnionType") {
                    return;
                }

                let literalCount = 0;
                for (const typeNode of node.typeAnnotation.types) {
                    if (
                        typeNode.type === "TSLiteralType" &&
                        typeNode.literal.type === "Literal" &&
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
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "enforce enums over string literal comparisons and pure string unions.",
            recommended: false,
            requiresTypeChecking: true,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-prefer-enum",
        },
        hasSuggestions: false,
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

export default rule;
