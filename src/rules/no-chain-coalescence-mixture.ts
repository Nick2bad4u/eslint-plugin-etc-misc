import type { TSESTree as es } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden";

type Options = readonly [];

const disallowedSelector =
    "LogicalExpression[operator='??'][left.type='ChainExpression']";

/**
 * Disallow mixing optional chaining expressions directly with nullish
 * coalescing.
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
    meta: {
        deprecated: false,
        docs: {
            deprecated: false,
            description:
                "disallow mixing chain and coalescence operators in a single expression.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-chain-coalescence-mixture",
        },
        hasSuggestions: false,
        languages: ["js/js"],
        messages: {
            forbidden:
                "Do not mix optional chaining and nullish coalescing in the same expression.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "no-chain-coalescence-mixture",
});

export default rule;
