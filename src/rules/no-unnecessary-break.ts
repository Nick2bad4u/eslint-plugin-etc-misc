import type { TSESTree as es } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden";

type Options = readonly [];

const disallowedSelector = "SwitchCase:last-child > BreakStatement.consequent";

/**
 * Disallow unnecessary trailing break statements in switch blocks.
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
            description: "disallow unnecessary trailing break statements.",
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-unnecessary-break",
        },
        hasSuggestions: false,
        messages: {
            forbidden:
                "Unnecessary break statement at end of switch case list.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "no-unnecessary-break",
});

export default rule;
