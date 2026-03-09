import type { TSESTree as es } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator";

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
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "disallow mixing chain and coalescence operators in a single expression.",
            recommended: false,
            url: "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/no-chain-coalescence-mixture.md",
        },
        hasSuggestions: false,
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
