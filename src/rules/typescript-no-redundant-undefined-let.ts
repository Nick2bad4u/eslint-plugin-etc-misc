import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

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

const isNeverReassigned = (
    sourceCode: Readonly<TSESLint.SourceCode>,
    declarator: Readonly<es.VariableDeclarator>
): boolean => {
    const [declaredVariable] = sourceCode.getDeclaredVariables(declarator);

    if (declaredVariable === undefined) {
        return false;
    }

    return !declaredVariable.references.some(
        (reference) => reference.isWrite() && reference.init !== true
    );
};

/**
 * Disallow redundant `undefined` unions on `let` declarations that are never
 * reassigned and initialized with definitely-defined values.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => {
        const sourceCode = context.sourceCode;

        return {
            "VariableDeclaration[kind='let'] > VariableDeclarator[id.type='Identifier']":
                (node: Readonly<es.VariableDeclarator>): void => {
                    const initializer = node.init;

                    if (initializer === null) {
                        return;
                    }

                    if (!isDefinitelyDefinedExpression(initializer)) {
                        return;
                    }

                    if (!isNeverReassigned(sourceCode, node)) {
                        return;
                    }

                    const id = node.id;

                    if (id.type !== "Identifier") {
                        return;
                    }

                    const typeAnnotation = id.typeAnnotation;

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

                    if (fixedTypeText === undefined) {
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
                "disallow redundant `undefined` in `let` type unions when declarations are never reassigned and initialized with definitely-defined values.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-no-redundant-undefined-let",
        },
        fixable: "code",
        hasSuggestions: true,
        messages: {
            forbidden:
                "Never-reassigned `let` declarations with definitely-defined initializers should not redundantly include `undefined` in their type union.",
            suggestRemoveRedundantUndefined:
                "Remove redundant `undefined` from this `let` declaration type union.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "typescript/no-redundant-undefined-let",
});

export default rule;
