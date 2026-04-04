import type { TSESTree as es } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden";

type Options = readonly [];

const selector = "TSTupleType > TSUnionType:not([types.length=1])";

/**
 * Disallow union element types directly inside tuple elements.
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
    meta: {
        deprecated: false,
        docs: {
            deprecated: false,
            description:
                "disallow union element types directly inside tuple element positions.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-no-multi-type-tuples",
        },
        hasSuggestions: false,
        messages: {
            forbidden:
                "Avoid multi-type tuple elements; extract a named alias instead.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "typescript/no-multi-type-tuples",
});

export default rule;
