import type { TSESTree as es } from "@typescript-eslint/utils";

import { AST_NODE_TYPES } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";
import {
    createReplacementRuleInfo,
    withDeprecatedRuleLifecycle,
} from "../_internal/rule-deprecation.js";

type MessageIds = "forbidden";

type Options = readonly [];

const selector = "TSTypeReference > Identifier[name='Map']";

/**
 * Require ReadonlyMap in place of Map type annotations.
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
                fix: (fixer) => fixer.replaceText(node, "ReadonlyMap"),
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
                "require ReadonlyMap instead of Map in type annotations.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-prefer-readonly-map",
        },
        fixable: "code",
        hasSuggestions: false,
        languages: ["js/js"],
        messages: {
            forbidden: "Prefer readonly map types.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "typescript/prefer-readonly-map",
});

/** Deprecated rule with explicit lifecycle and replacement metadata. */
const deprecatedRule: typeof rule = withDeprecatedRuleLifecycle(rule, {
    availableUntil: "4.0.0",
    deprecatedSince: "3.0.0",
    message:
        "Deprecated in favor of the scoped readonly-map rules and @typescript-eslint/prefer-readonly-parameter-types.",
    replacedBy: [
        createReplacementRuleInfo({
            rule: {
                name: "typescript/require-readonly-map-property-type",
                url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-require-readonly-map-property-type",
            },
        }),
        createReplacementRuleInfo({
            rule: {
                name: "typescript/require-readonly-map-return-type",
                url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-require-readonly-map-return-type",
            },
        }),
        createReplacementRuleInfo({
            rule: {
                name: "typescript/require-readonly-map-type-alias",
                url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-require-readonly-map-type-alias",
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
    ruleId: "typescript/prefer-readonly-map",
});

export default deprecatedRule;
