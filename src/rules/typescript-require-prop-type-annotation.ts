import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden" | "suggestAnnotateUnknown";

type Options = readonly [];

const selector = "PropertyDefinition[typeAnnotation=undefined][value=null]";

/**
 * Require explicit type annotations for uninitialized class properties.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => ({
        [selector]: (node: Readonly<es.Node>): void => {
            if (node.type !== "PropertyDefinition") {
                return;
            }

            const canProvideSafeSuggestion =
                node.computed !== true &&
                node.key.type === "Identifier" &&
                node.optional !== true &&
                node.definite !== true;

            const fix =
                canProvideSafeSuggestion === true
                    ? (fixer: Readonly<TSESLint.RuleFixer>): TSESLint.RuleFix =>
                          fixer.insertTextAfter(node.key, ": unknown")
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
                                  messageId: "suggestAnnotateUnknown",
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
            description:
                "require explicit type annotations for class properties without initializers.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-require-prop-type-annotation",
        },
        fixable: "code",
        hasSuggestions: true,
        messages: {
            forbidden: "Expecting a type annotation for this property.",
            suggestAnnotateUnknown:
                "Add an explicit ': unknown' type annotation.",
        },
        schema: [],
        type: "problem",
    },
    name: "typescript/require-prop-type-annotation",
});

export default rule;
