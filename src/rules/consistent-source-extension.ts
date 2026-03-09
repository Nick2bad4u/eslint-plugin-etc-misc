import type { TSESTree as es } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";
import {
    createReplacementRuleInfo,
    withDeprecatedRuleLifecycle,
} from "../_internal/rule-deprecation.js";

type MessageIds = "forbidden";

type Options = readonly [];

const disallowedSelector = String.raw`Literal.source[value=/\.(?:js|json|ts)$/u]`;

/**
 * Disallow explicit `.js`, `.json`, and `.ts` source extensions in
 * imports/exports.
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
                "require consistent import/export source paths without file extensions.",
            recommended: false,
            url: "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/consistent-source-extension.md",
        },
        hasSuggestions: false,
        messages: {
            forbidden:
                "Remove the source file extension from this import/export path.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "consistent-source-extension",
});

/**
 * Wrapper rule with explicit lifecycle metadata and replacement mapping.
 */
const deprecatedRule: typeof rule = withDeprecatedRuleLifecycle(rule, {
    message: "Deprecated in favor of import/extensions.",
    replacedBy: [
        createReplacementRuleInfo({
            plugin: {
                name: "import",
                url: "https://github.com/import-js/eslint-plugin-import",
            },
            rule: {
                name: "extensions",
                url: "https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/extensions.md",
            },
        }),
    ],
    ruleId: "consistent-source-extension",
});

export default deprecatedRule;
