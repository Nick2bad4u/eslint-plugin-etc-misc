import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

import { arrayJoin, isDefined, isEmpty } from "ts-extras";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden" | "suggestRemoveRedundantUndefined";

type Options = readonly [];

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

    if (unwrappedExpression.type === "FunctionExpression") {
        return true;
    }

    if (unwrappedExpression.type === "Literal") {
        return true;
    }

    if (unwrappedExpression.type === "NewExpression") {
        return true;
    }

    if (unwrappedExpression.type === "ObjectExpression") {
        return true;
    }

    if (unwrappedExpression.type === "TemplateLiteral") {
        return true;
    }

    return false;
};

/**
 * Disallow redundant `undefined` unions on readonly class properties with
 * definitely-defined initializers.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => {
        const sourceCode = context.sourceCode;

        return {
            "PropertyDefinition[readonly=true][optional!=true]": (
                node: Readonly<es.Node>
            ): void => {
                if (node.type !== "PropertyDefinition") {
                    return;
                }

                if (node.declare) {
                    return;
                }

                if (node.value === null) {
                    return;
                }

                if (!isDefinitelyDefinedExpression(node.value)) {
                    return;
                }

                const typeAnnotation = node.typeAnnotation;

                if (typeAnnotation === undefined) {
                    return;
                }

                if (typeAnnotation.typeAnnotation.type !== "TSUnionType") {
                    return;
                }

                const fixedTypeText = buildFixedTypeText(
                    sourceCode,
                    typeAnnotation.typeAnnotation
                );

                if (!isDefined(fixedTypeText)) {
                    return;
                }

                const fix = (
                    fixer: Readonly<TSESLint.RuleFixer>
                ): TSESLint.RuleFix =>
                    fixer.replaceText(
                        typeAnnotation.typeAnnotation,
                        fixedTypeText
                    );

                context.report({
                    fix,
                    messageId: "forbidden",
                    node: typeAnnotation.typeAnnotation,
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
                "disallow redundant `undefined` in readonly property union types when the initializer is definitely defined.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-no-redundant-undefined-readonly-property",
        },
        fixable: "code",
        hasSuggestions: true,
        messages: {
            forbidden:
                "Readonly properties with definitely-defined initializers should not redundantly include `undefined` in their type union.",
            suggestRemoveRedundantUndefined:
                "Remove redundant `undefined` from this readonly property type union.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "typescript/no-redundant-undefined-readonly-property",
});

export default rule;
