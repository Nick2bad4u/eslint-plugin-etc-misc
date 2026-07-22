import type { TSESTree as es } from "@typescript-eslint/utils";

import { arrayJoin } from "ts-extras";

import { ruleCreator } from "../_internal/rule-creator.js";
import {
    createReplacementRuleInfo,
    withDeprecatedRuleLifecycle,
} from "../_internal/rule-deprecation.js";

type MessageIds = "forbidden";

type Options = readonly [];

const disallowedSelector = arrayJoin(
    [
        "ExportNamedDeclaration > FunctionDeclaration > Identifier.id[name=/^_/u]",
        "ExportNamedDeclaration > TSDeclareFunction > Identifier.id[name=/^_/u]",
        "ExportNamedDeclaration > VariableDeclaration > VariableDeclarator > Identifier.id[name=/^_/u]",
    ],
    ", "
);

/**
 * Disallow named exports whose identifier starts with an underscore.
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
            description: "disallow underscore-prefixed named exports.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-underscore-export",
        },
        hasSuggestions: false,
        languages: ["js/js"],
        messages: {
            forbidden: "No underscore exports.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "no-underscore-export",
});

/** Deprecated rule with explicit lifecycle and replacement metadata. */
const deprecatedRule: typeof rule = withDeprecatedRuleLifecycle(rule, {
    availableUntil: "4.0.0",
    deprecatedSince: "3.0.0",
    message: "Deprecated in favor of ESLint core no-restricted-exports.",
    replacedBy: [
        createReplacementRuleInfo({
            plugin: {
                name: "eslint",
                url: "https://eslint.org/docs/latest/rules/",
            },
            rule: {
                name: "no-restricted-exports",
                url: "https://eslint.org/docs/latest/rules/no-restricted-exports",
            },
        }),
    ],
    ruleId: "no-underscore-export",
});

export default deprecatedRule;
