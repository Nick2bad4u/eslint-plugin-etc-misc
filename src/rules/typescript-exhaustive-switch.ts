import type { TSESTree as es } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";
import {
    createReplacementRuleInfo,
    withDeprecatedRuleLifecycle,
} from "../_internal/rule-deprecation.js";

type MessageIds = "forbidden";

type Options = readonly [];

const selector =
    "SwitchStatement[cases.length>1]:not(:has(SwitchCase[test=null]))";

/**
 * Require a default case in non-trivial switch statements.
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
        deprecated: true,
        docs: {
            deprecated: true,
            description:
                "require a default case in switch statements with multiple branches.",
            frozen: true,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-exhaustive-switch",
        },
        hasSuggestions: false,
        messages: {
            forbidden: "Add a default case to make this switch exhaustive.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "typescript/exhaustive-switch",
});

/**
 * Wrapper rule with explicit lifecycle metadata and replacement mapping.
 */
const deprecatedRule: typeof rule = withDeprecatedRuleLifecycle(rule, {
    message:
        "Deprecated in favor of @typescript-eslint/switch-exhaustiveness-check.",
    replacedBy: [
        createReplacementRuleInfo({
            plugin: {
                name: "@typescript-eslint",
                url: "https://typescript-eslint.io/",
            },
            rule: {
                name: "switch-exhaustiveness-check",
                url: "https://typescript-eslint.io/rules/switch-exhaustiveness-check",
            },
        }),
    ],
    ruleId: "typescript/exhaustive-switch",
});

export default deprecatedRule;
