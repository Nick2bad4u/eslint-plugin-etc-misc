import type { TSESTree as es } from "@typescript-eslint/utils";

import { AST_NODE_TYPES } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";
import {
    createReplacementRuleInfo,
    withDeprecatedRuleLifecycle,
} from "../_internal/rule-deprecation.js";

type MessageIds = "forbidden";

type Options = readonly [];

const selector = "TSTypeReference > Identifier[name='Set']";

/**
 * Require ReadonlySet in place of Set type annotations.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => ({
        [selector]: (node: Readonly<es.Node>): void => {
            if (node.type !== AST_NODE_TYPES.Identifier) {
                return;
            }

            context.report({
                fix: (fixer) => fixer.replaceText(node, "ReadonlySet"),
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
                "require ReadonlySet instead of Set in type annotations.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-prefer-readonly-set",
        },
        fixable: "code",
        hasSuggestions: false,
        languages: ["js/js"],
        messages: {
            forbidden: "Prefer readonly set types.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "typescript/prefer-readonly-set",
});

/** Deprecated rule with explicit lifecycle and replacement metadata. */
const deprecatedRule: typeof rule = withDeprecatedRuleLifecycle(rule, {
    availableUntil: "4.0.0",
    deprecatedSince: "3.0.0",
    message:
        "Deprecated in favor of the scoped readonly-set rules and @typescript-eslint/prefer-readonly-parameter-types.",
    replacedBy: [
        createReplacementRuleInfo({
            rule: {
                name: "typescript/require-readonly-set-property-type",
                url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-require-readonly-set-property-type",
            },
        }),
        createReplacementRuleInfo({
            rule: {
                name: "typescript/require-readonly-set-return-type",
                url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-require-readonly-set-return-type",
            },
        }),
        createReplacementRuleInfo({
            rule: {
                name: "typescript/require-readonly-set-type-alias",
                url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-require-readonly-set-type-alias",
            },
        }),
        createReplacementRuleInfo({
            plugin: {
                name: "@typescript-eslint",
                url: "https://typescript-eslint.io/",
            },
            rule: {
                name: "prefer-readonly-parameter-types",
                url: "https://typescript-eslint.io/rules/prefer-readonly-parameter-types/",
            },
        }),
    ],
    ruleId: "typescript/prefer-readonly-set",
});

export default deprecatedRule;
