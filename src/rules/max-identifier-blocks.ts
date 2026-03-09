import type { TSESTree as es } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden";

type Options = readonly [];

const blockRegexSuffix = "[name=/^[A-Z]*[^A-Z]+([A-Z]+[^A-Z]+){4}/u]";
const disallowedSelector = [
    `Identifier.id${blockRegexSuffix}`,
    `:not(Property[shorthand=true]) > Identifier.key${blockRegexSuffix}`,
].join(", ");

/**
 * Disallow identifiers containing more than four casing blocks.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => ({
        [disallowedSelector]: (node: Readonly<es.Node>): void => {
            context.report({
                messageId: "forbidden",
                node,
            });
        },
    }),
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "disallow identifiers with more than four casing blocks.",
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/max-identifier-blocks",
        },
        hasSuggestions: false,
        messages: {
            forbidden: "Identifier should not contain more than 4 blocks.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "max-identifier-blocks",
});

export default rule;
