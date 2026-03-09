import type { TSESTree as es } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden";

type Options = readonly [];

const languageMixPattern = String.raw`/\w[\d_]*[^\u0000-\u00FF]|[^\u0000-\u00FF][\d_]*\w/u`;
const disallowedSelector = [
    `Literal[value=${languageMixPattern}]`,
    `TemplateElement[value.raw=${languageMixPattern}]`,
].join(", ");

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
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "disallow mixed-language tokens combining latin and non-latin letters.",
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-language-mixing",
        },
        hasSuggestions: false,
        messages: {
            forbidden: "Do not mix languages in a single token.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "no-language-mixing",
});

export default rule;
