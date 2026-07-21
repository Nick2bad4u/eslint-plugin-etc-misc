import type { TSESTree as es } from "@typescript-eslint/utils";

import { arrayJoin } from "ts-extras";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden";

type Options = readonly [];

// eslint-disable-next-line etc-misc/no-unnecessary-template-literal -- String.raw preserves selector escapes.
const languageMixPattern = String.raw`/\w[\d_]*[^\u0000-\xff]|[^\u0000-\xff][\d_]*\w/u`;
const disallowedSelector = arrayJoin(
    [
        `Literal[value=${languageMixPattern}]`,
        `TemplateElement[value.raw=${languageMixPattern}]`,
    ],
    ", "
);

/**
 * Disallow mixing latin and non-latin letters within the same token.
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
                "disallow mixed-language tokens combining latin and non-latin letters.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-language-mixing",
        },
        hasSuggestions: false,
        languages: ["js/js"],
        messages: {
            forbidden: "Do not mix languages in a single token.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "no-language-mixing",
});

export default rule;
