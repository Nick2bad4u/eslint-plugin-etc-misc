import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden";

type Options = readonly [];

const selector = [
    "TSPropertySignature[optional=true] > TSTypeAnnotation > TSUnionType",
    "PropertyDefinition[optional=true] > TSTypeAnnotation > TSUnionType",
].join(", ");

const buildOptionalUnionFixText = (
    sourceCode: Readonly<TSESLint.SourceCode>,
    unionType: Readonly<es.TSUnionType>
): string | undefined => {
    const nonUndefinedTypeTexts: string[] = [];

    for (const typeNode of unionType.types) {
        if (typeNode.type === "TSUndefinedKeyword") {
            continue;
        }

        nonUndefinedTypeTexts.push(sourceCode.getText(typeNode));
    }

    if (
        nonUndefinedTypeTexts.length === 0 ||
        nonUndefinedTypeTexts.length === unionType.types.length
    ) {
        return undefined;
    }

    return nonUndefinedTypeTexts.join(" | ");
};

/**
 * Disallow redundant `undefined` unions on already-optional properties.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => {
        const sourceCode = context.sourceCode;

        return {
            [selector]: (node: Readonly<es.Node>): void => {
                if (node.type !== "TSUnionType") {
                    return;
                }

                const fixedTypeText = buildOptionalUnionFixText(
                    sourceCode,
                    node
                );

                const fix =
                    fixedTypeText === undefined
                        ? undefined
                        : (
                              fixer: Readonly<TSESLint.RuleFixer>
                          ): TSESLint.RuleFix =>
                              fixer.replaceText(node, fixedTypeText);

                context.report({
                    ...(fix === undefined ? {} : { fix }),
                    messageId: "forbidden",
                    node,
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
                "disallow redundant `undefined` unions on optional property declarations.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/consistent-optional-props",
        },
        fixable: "code",
        hasSuggestions: false,
        messages: {
            forbidden:
                "Optional properties should not redundantly include `undefined` in their type union.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "consistent-optional-props",
});

export default rule;
