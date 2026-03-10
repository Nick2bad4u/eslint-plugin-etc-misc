import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden" | "suggestAddReadonly";

type Options = readonly [];

const selector =
    ":matches(PropertyDefinition, TSPropertySignature)[readonly!=true]";

/**
 * Require readonly modifiers on class and interface properties.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => ({
        [selector]: (node: Readonly<es.Node>): void => {
            if (
                node.type !== "PropertyDefinition" &&
                node.type !== "TSPropertySignature"
            ) {
                return;
            }

            const keyNode = node.key;

            const fix =
                keyNode.type === "Identifier" ||
                keyNode.type === "PrivateIdentifier" ||
                keyNode.type === "Literal"
                    ? (fixer: Readonly<TSESLint.RuleFixer>): TSESLint.RuleFix =>
                          fixer.insertTextBefore(keyNode, "readonly ")
                    : undefined;

            context.report({
                messageId: "forbidden",
                node,
                ...(fix === undefined
                    ? {}
                    : {
                          fix,
                          suggest: [
                              {
                                  fix,
                                  messageId: "suggestAddReadonly",
                              },
                          ],
                      }),
            });
        },
    }),
    defaultOptions: [],
    meta: {
        deprecated: false,
        docs: {
            deprecated: false,
            description: "require readonly for class and interface properties.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-prefer-readonly-property",
        },
        fixable: "code",
        hasSuggestions: true,
        messages: {
            forbidden: "Prefer readonly property declarations.",
            suggestAddReadonly:
                "Insert readonly modifier for this property declaration.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "typescript/prefer-readonly-property",
});

export default rule;
