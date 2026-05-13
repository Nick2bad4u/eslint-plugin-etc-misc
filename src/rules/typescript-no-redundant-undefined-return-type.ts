import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import { arrayAt, arrayFirst, arrayJoin, isDefined, isEmpty } from "ts-extras";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden" | "suggestRemoveRedundantUndefined";

type Options = readonly [];

type ReturnableFunctionNode =
    | es.ArrowFunctionExpression
    | es.FunctionDeclaration
    | es.FunctionExpression;

const buildFixedTypeText = (
    sourceCode: Readonly<TSESLint.SourceCode>,
    unionType: Readonly<es.TSUnionType>
): string | undefined => {
    let nonUndefinedTypeTexts: readonly string[] = [];

    for (const typeNode of unionType.types) {
        if (typeNode.type === AST_NODE_TYPES.TSUndefinedKeyword) {
            continue;
        }

        nonUndefinedTypeTexts = [
            ...nonUndefinedTypeTexts,
            sourceCode.getText(typeNode),
        ];
    }

    if (
        isEmpty(nonUndefinedTypeTexts) ||
        nonUndefinedTypeTexts.length === unionType.types.length
    ) {
        return undefined;
    }

    return arrayJoin(nonUndefinedTypeTexts, " | ");
};

const unwrapExpression = (
    expression: Readonly<es.Expression>
): Readonly<es.Expression> => {
    if (
        expression.type === AST_NODE_TYPES.TSAsExpression ||
        expression.type === AST_NODE_TYPES.TSSatisfiesExpression ||
        expression.type === AST_NODE_TYPES.TSNonNullExpression ||
        expression.type === AST_NODE_TYPES.TSTypeAssertion
    ) {
        return unwrapExpression(expression.expression);
    }

    return expression;
};

const isDefinitelyDefinedExpression = (
    expression: Readonly<es.Expression>
): boolean => {
    const unwrappedExpression = unwrapExpression(expression);

    if (unwrappedExpression.type === AST_NODE_TYPES.ArrayExpression) {
        return true;
    }

    if (unwrappedExpression.type === AST_NODE_TYPES.ArrowFunctionExpression) {
        return true;
    }

    if (unwrappedExpression.type === AST_NODE_TYPES.ClassExpression) {
        return true;
    }

    if (unwrappedExpression.type === AST_NODE_TYPES.ConditionalExpression) {
        return (
            isDefinitelyDefinedExpression(unwrappedExpression.consequent) &&
            isDefinitelyDefinedExpression(unwrappedExpression.alternate)
        );
    }

    if (unwrappedExpression.type === AST_NODE_TYPES.FunctionExpression) {
        return true;
    }

    if (unwrappedExpression.type === AST_NODE_TYPES.Literal) {
        return true;
    }

    if (
        unwrappedExpression.type === AST_NODE_TYPES.LogicalExpression &&
        unwrappedExpression.operator === "??"
    ) {
        return isDefinitelyDefinedExpression(unwrappedExpression.right);
    }

    if (unwrappedExpression.type === AST_NODE_TYPES.NewExpression) {
        return true;
    }

    if (unwrappedExpression.type === AST_NODE_TYPES.ObjectExpression) {
        return true;
    }

    if (unwrappedExpression.type === AST_NODE_TYPES.SequenceExpression) {
        const lastExpression = arrayAt(unwrappedExpression.expressions, -1);

        return (
            lastExpression !== undefined &&
            isDefinitelyDefinedExpression(lastExpression)
        );
    }

    if (unwrappedExpression.type === AST_NODE_TYPES.TemplateLiteral) {
        return true;
    }

    return false;
};

const hasDefinitelyDefinedReturnValue = (
    node: Readonly<ReturnableFunctionNode>
): boolean => {
    const body = node.body;

    if (body.type !== AST_NODE_TYPES.BlockStatement) {
        return isDefinitelyDefinedExpression(body);
    }

    if (body.body.length !== 1) {
        return false;
    }

    const statement = arrayFirst(body.body);

    if (statement === undefined) {
        return false;
    }

    if (statement.type !== AST_NODE_TYPES.ReturnStatement) {
        return false;
    }

    if (statement.argument === null) {
        return false;
    }

    return isDefinitelyDefinedExpression(statement.argument);
};

/**
 * Disallow redundant `undefined` in return type unions when the function body
 * deterministically returns a definitely-defined value.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => {
        const sourceCode = context.sourceCode;

        return {
            ":matches(ArrowFunctionExpression, FunctionDeclaration, FunctionExpression)":
                (node: Readonly<es.Node>): void => {
                    if (
                        node.type !== AST_NODE_TYPES.ArrowFunctionExpression &&
                        node.type !== AST_NODE_TYPES.FunctionDeclaration &&
                        node.type !== AST_NODE_TYPES.FunctionExpression
                    ) {
                        return;
                    }

                    const returnType = node.returnType;

                    if (returnType === undefined) {
                        return;
                    }

                    if (
                        returnType.typeAnnotation.type !==
                        AST_NODE_TYPES.TSUnionType
                    ) {
                        return;
                    }

                    if (!hasDefinitelyDefinedReturnValue(node)) {
                        return;
                    }

                    const fixedTypeText = buildFixedTypeText(
                        sourceCode,
                        returnType.typeAnnotation
                    );

                    if (!isDefined(fixedTypeText)) {
                        return;
                    }

                    const fix = (
                        fixer: Readonly<TSESLint.RuleFixer>
                    ): TSESLint.RuleFix =>
                        fixer.replaceText(
                            returnType.typeAnnotation,
                            fixedTypeText
                        );

                    context.report({
                        fix,
                        messageId: "forbidden",
                        node: returnType.typeAnnotation,
                        suggest: [
                            {
                                fix,
                                messageId: "suggestRemoveRedundantUndefined",
                            },
                        ],
                    });
                },
        };
    },
    meta: {
        deprecated: false,
        docs: {
            deprecated: false,
            description:
                "disallow redundant `undefined` in return type unions when the function deterministically returns a definitely-defined value.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-no-redundant-undefined-return-type",
        },
        fixable: "code",
        hasSuggestions: true,
        messages: {
            forbidden:
                "Return types should not redundantly include `undefined` when the function deterministically returns a definitely-defined value.",
            suggestRemoveRedundantUndefined:
                "Remove redundant `undefined` from this return type union.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "typescript/no-redundant-undefined-return-type",
});

export default rule;
