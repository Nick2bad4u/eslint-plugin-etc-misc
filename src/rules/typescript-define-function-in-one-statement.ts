import type { TSESTree as es } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden";

type Options = readonly [];

const selector =
    "AssignmentExpression > MemberExpression.left > Identifier.object";

/**
 * Require defining function properties in a single statement.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => ({
        [selector]: (node: Readonly<es.Node>): void => {
            context.report({
                messageId: "forbidden",
                node,
            });
        },
    }),
    defaultOptions: [],
    meta: {
        deprecated: false,
        docs: {
            deprecated: false,
            description:
                "require defining function properties in a single statement.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-define-function-in-one-statement",
        },
        hasSuggestions: false,
        messages: {
            forbidden:
                "Use `Object.assign` to define function properties in one statement.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "typescript/define-function-in-one-statement",
});

export default rule;
