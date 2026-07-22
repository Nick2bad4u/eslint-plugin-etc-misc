import type { TSESTree as es } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";
import {
    createReplacementRuleInfo,
    withDeprecatedRuleLifecycle,
} from "../_internal/rule-deprecation.js";

type MessageIds = "forbidden";

type Options = readonly [];

const disallowedSelector =
    "TSInterfaceBody > TSCallSignatureDeclaration:not(:first-child)";

/**
 * Require interface call signatures to appear before all other members.
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
                "require call signatures to be the first member in interfaces.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/sort-call-signature",
        },
        hasSuggestions: false,
        languages: ["js/js"],
        messages: {
            forbidden: "Call signature should be first.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "sort-call-signature",
});

/** Deprecated rule with explicit lifecycle and replacement metadata. */
const deprecatedRule: typeof rule = withDeprecatedRuleLifecycle(rule, {
    availableUntil: "4.0.0",
    deprecatedSince: "3.0.0",
    message: "Deprecated in favor of @typescript-eslint/member-ordering.",
    replacedBy: [
        createReplacementRuleInfo({
            plugin: {
                name: "@typescript-eslint",
                url: "https://typescript-eslint.io/",
            },
            rule: {
                name: "member-ordering",
                url: "https://typescript-eslint.io/rules/member-ordering/",
            },
        }),
    ],
    ruleId: "sort-call-signature",
});

export default deprecatedRule;
