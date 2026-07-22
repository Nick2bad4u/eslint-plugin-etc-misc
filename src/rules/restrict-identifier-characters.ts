import type { TSESTree as es } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";
import {
    createReplacementRuleInfo,
    withDeprecatedRuleLifecycle,
} from "../_internal/rule-deprecation.js";

type MessageIds = "forbidden";

type Options = readonly [];

const disallowedSelector = String.raw`Identifier[name=/[^$\w]/u]`;

/**
 * Restrict identifiers to latin letters, digits, underscores, and dollar signs.
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
                "require identifiers to contain only english characters, digits, underscore, or dollar sign.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/restrict-identifier-characters",
        },
        hasSuggestions: false,
        languages: ["js/js"],
        messages: {
            forbidden:
                "Identifier must consist of english characters and dollar sign.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "restrict-identifier-characters",
});

/** Deprecated rule with explicit lifecycle and replacement metadata. */
const deprecatedRule: typeof rule = withDeprecatedRuleLifecycle(rule, {
    availableUntil: "4.0.0",
    deprecatedSince: "3.0.0",
    message: "Deprecated in favor of ESLint core id-match.",
    replacedBy: [
        createReplacementRuleInfo({
            plugin: {
                name: "eslint",
                url: "https://eslint.org/docs/latest/rules/",
            },
            rule: {
                name: "id-match",
                url: "https://eslint.org/docs/latest/rules/id-match",
            },
        }),
    ],
    ruleId: "restrict-identifier-characters",
});

export default deprecatedRule;
