import type { TSESTree as es } from "@typescript-eslint/utils";

import { arrayJoin } from "ts-extras";

import { countIdentifierBlocks } from "../_internal/identifier-blocks.js";
import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden";

type Options = readonly [];

const maxIdentifierBlocks = 4;

const disallowedSelector = arrayJoin(
    ["Identifier.id", ":not(Property[shorthand=true]) > Identifier.key"],
    ", "
);

/**
 * Disallow identifiers containing more than four casing blocks.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => ({
        [disallowedSelector]: (node: Readonly<es.Identifier>): void => {
            if (countIdentifierBlocks(node.name) <= maxIdentifierBlocks) {
                return;
            }

            context.report({
                data: {
                    max: maxIdentifierBlocks,
                },
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
                "disallow identifiers with more than four casing blocks.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/max-identifier-blocks",
        },
        hasSuggestions: false,
        languages: ["js/js"],
        messages: {
            forbidden:
                "Identifier should not contain more than {{max}} blocks.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "max-identifier-blocks",
});

export default rule;
