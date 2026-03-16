import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

import { arrayFirst } from "ts-extras";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden" | "suggestAddThisVoid";

type Options = readonly [];

const selector =
    "MethodDefinition[static=true] > FunctionExpression:not([params.0.name='this'][params.0.typeAnnotation.typeAnnotation.type='TSVoidKeyword'])";

const createThisVoidSuggestionFix = (
    sourceCode: Readonly<TSESLint.SourceCode>,
    functionExpression: Readonly<es.FunctionExpression>
): TSESLint.ReportFixFunction | undefined => {
    const firstParameter = arrayFirst(functionExpression.params);

    if (
        firstParameter?.type === "Identifier" &&
        firstParameter.name === "this"
    ) {
        const existingTypeAnnotation = firstParameter.typeAnnotation;

        if (existingTypeAnnotation === undefined) {
            return (fixer) => fixer.insertTextAfter(firstParameter, ": void");
        }

        return (fixer) => fixer.replaceText(existingTypeAnnotation, ": void");
    }

    const openingParenthesisToken =
        sourceCode.getFirstToken(functionExpression);
    if (openingParenthesisToken?.value !== "(") {
        return undefined;
    }

    return (fixer) =>
        fixer.insertTextAfter(
            openingParenthesisToken,
            firstParameter === undefined ? "this: void" : "this: void, "
        );
};

/**
 * Require static class methods to declare `this: void`.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => {
        const sourceCode = context.sourceCode;

        return {
            [selector]: (node: Readonly<es.Node>): void => {
                if (node.type !== "FunctionExpression") {
                    return;
                }

                const suggestionFix = createThisVoidSuggestionFix(
                    sourceCode,
                    node
                );

                context.report({
                    messageId: "forbidden",
                    node,
                    ...(suggestionFix === undefined
                        ? {}
                        : {
                              fix: suggestionFix,
                              suggest: [
                                  {
                                      fix: suggestionFix,
                                      messageId: "suggestAddThisVoid",
                                  },
                              ],
                          }),
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
                "require static class methods to declare `this: void`.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-require-this-void",
        },
        fixable: "code",
        hasSuggestions: true,
        messages: {
            forbidden: 'Add "this: void" to static method signatures.',
            suggestAddThisVoid: 'Insert "this: void" parameter in signature.',
        },
        schema: [],
        type: "problem",
    },
    name: "typescript/require-this-void",
});

export default rule;
