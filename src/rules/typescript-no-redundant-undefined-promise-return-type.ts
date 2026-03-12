import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

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
        if (typeNode.type === "TSUndefinedKeyword") {
            continue;
        }

        nonUndefinedTypeTexts = [
            ...nonUndefinedTypeTexts,
            sourceCode.getText(typeNode),
        ];
    }

    if (
        nonUndefinedTypeTexts.length === 0 ||
        nonUndefinedTypeTexts.length === unionType.types.length
    ) {
        return undefined;
    }

    return nonUndefinedTypeTexts.join(" | ");
};

const unwrapExpression = (
    expression: Readonly<es.Expression>
): Readonly<es.Expression> => {
    if (
        expression.type === "TSAsExpression" ||
        expression.type === "TSSatisfiesExpression" ||
        expression.type === "TSNonNullExpression" ||
        expression.type === "TSTypeAssertion"
    ) {
        return unwrapExpression(expression.expression);
    }

    return expression;
};

const isDefinitelyDefinedExpression = (
    expression: Readonly<es.Expression>
): boolean => {
    const unwrappedExpression = unwrapExpression(expression);

    if (unwrappedExpression.type === "ArrayExpression") {
        return true;
    }

    if (unwrappedExpression.type === "ArrowFunctionExpression") {
        return true;
    }

    if (unwrappedExpression.type === "ClassExpression") {
        return true;
    }

    if (unwrappedExpression.type === "ConditionalExpression") {
        return (
            isDefinitelyDefinedExpression(unwrappedExpression.consequent) &&
            isDefinitelyDefinedExpression(unwrappedExpression.alternate)
        );
    }

    if (unwrappedExpression.type === "FunctionExpression") {
        return true;
    }

    if (unwrappedExpression.type === "Literal") {
        return true;
    }

    if (
        unwrappedExpression.type === "LogicalExpression" &&
        unwrappedExpression.operator === "??"
    ) {
        return isDefinitelyDefinedExpression(unwrappedExpression.right);
    }

    if (unwrappedExpression.type === "NewExpression") {
        return true;
    }

    if (unwrappedExpression.type === "ObjectExpression") {
        return true;
    }

    if (unwrappedExpression.type === "SequenceExpression") {
        const lastExpression = unwrappedExpression.expressions.at(-1);

        return (
            lastExpression !== undefined &&
            isDefinitelyDefinedExpression(lastExpression)
        );
    }

    if (unwrappedExpression.type === "TemplateLiteral") {
        return true;
    }

    return false;
};

const hasDefinitelyDefinedReturnValue = (
    node: Readonly<ReturnableFunctionNode>
): boolean => {
    const body = node.body;

    if (body.type !== "BlockStatement") {
        return isDefinitelyDefinedExpression(body);
    }

    if (body.body.length !== 1) {
        return false;
    }

    const statement = body.body[0];

    if (statement === undefined) {
        return false;
    }

    if (statement.type !== "ReturnStatement") {
        return false;
    }

    if (statement.argument === null) {
        return false;
    }

    return isDefinitelyDefinedExpression(statement.argument);
};

const getPromiseValueUnionType = (
    returnType: Readonly<es.TSTypeAnnotation>
): Readonly<es.TSUnionType> | undefined => {
    const annotation = returnType.typeAnnotation;

    if (annotation.type !== "TSTypeReference") {
        return undefined;
    }

    if (annotation.typeName.type !== "Identifier") {
        return undefined;
    }

    if (annotation.typeName.name !== "Promise") {
        return undefined;
    }

    const typeArguments = annotation.typeArguments;

    if (typeArguments?.params.length !== 1) {
        return undefined;
    }

    const [promiseValueType] = typeArguments.params;

    if (promiseValueType === undefined) {
        return undefined;
    }

    if (promiseValueType.type !== "TSUnionType") {
        return undefined;
    }

    return promiseValueType;
};

/**
 * Disallow redundant `undefined` inside Promise return type unions for async
 * functions that deterministically return definitely-defined values.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => {
        const sourceCode = context.sourceCode;

        return {
            ":matches(ArrowFunctionExpression, FunctionDeclaration, FunctionExpression)[async=true]":
                (node: Readonly<es.Node>): void => {
                    if (
                        node.type !== "ArrowFunctionExpression" &&
                        node.type !== "FunctionDeclaration" &&
                        node.type !== "FunctionExpression"
                    ) {
                        return;
                    }

                    const returnType = node.returnType;

                    if (returnType === undefined) {
                        return;
                    }

                    const promiseValueUnionType =
                        getPromiseValueUnionType(returnType);

                    if (promiseValueUnionType === undefined) {
                        return;
                    }

                    if (!hasDefinitelyDefinedReturnValue(node)) {
                        return;
                    }

                    const fixedPromiseValueTypeText = buildFixedTypeText(
                        sourceCode,
                        promiseValueUnionType
                    );

                    if (fixedPromiseValueTypeText === undefined) {
                        return;
                    }

                    const fix = (
                        fixer: Readonly<TSESLint.RuleFixer>
                    ): TSESLint.RuleFix =>
                        fixer.replaceText(
                            promiseValueUnionType,
                            fixedPromiseValueTypeText
                        );

                    context.report({
                        fix,
                        messageId: "forbidden",
                        node: promiseValueUnionType,
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
    defaultOptions: [],
    meta: {
        deprecated: false,
        docs: {
            deprecated: false,
            description:
                "disallow redundant `undefined` in Promise return value unions for async functions that deterministically return definitely-defined values.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-no-redundant-undefined-promise-return-type",
        },
        fixable: "code",
        hasSuggestions: true,
        messages: {
            forbidden:
                "Async Promise return value unions should not redundantly include `undefined` when the function deterministically returns definitely-defined values.",
            suggestRemoveRedundantUndefined:
                "Remove redundant `undefined` from this Promise return value union.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "typescript/no-redundant-undefined-promise-return-type",
});

export default rule;
