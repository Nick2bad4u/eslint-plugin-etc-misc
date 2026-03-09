import type { TSESTree as es } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden";

type Options = readonly [];

const maxIdentifierBlocks = 4;

const disallowedSelector = [
    "Identifier.id",
    ":not(Property[shorthand=true]) > Identifier.key",
].join(", ");

const countIdentifierBlocks = (identifierName: string): number =>
    identifierName
        .replaceAll(/(?<=[\da-z])(?=[A-Z])/gu, " ")
        .replaceAll(/[^0-9A-Za-z]+/gu, " ")
        .trim()
        .split(/\s+/u)
        .filter((segment) => segment.length > 0).length;

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
            forbidden:
                "Identifier should not contain more than {{max}} blocks.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "max-identifier-blocks",
});

export default rule;
