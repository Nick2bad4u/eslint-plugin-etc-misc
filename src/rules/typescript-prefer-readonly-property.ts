import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import { isDefined } from "ts-extras";

import { ruleCreator } from "../_internal/rule-creator.js";
import {
    createReplacementRuleInfo,
    withDeprecatedRuleLifecycle,
} from "../_internal/rule-deprecation.js";

type MessageIds = "forbidden" | "suggestAddReadonly";

type Options = readonly [];

const selector =
    ":matches(PropertyDefinition, TSPropertySignature)[readonly!=true]";

/**
 * Require readonly modifiers on class and interface properties.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => ({
        [selector]: (node: Readonly<es.Node>): void => {
            if (
                node.type !== AST_NODE_TYPES.PropertyDefinition &&
                node.type !== AST_NODE_TYPES.TSPropertySignature
            ) {
                return;
            }

            const keyNode = node.key;

            const fix =
                keyNode.type === AST_NODE_TYPES.Identifier ||
                keyNode.type === AST_NODE_TYPES.PrivateIdentifier ||
                keyNode.type === AST_NODE_TYPES.Literal
                    ? (fixer: Readonly<TSESLint.RuleFixer>): TSESLint.RuleFix =>
                          fixer.insertTextBefore(keyNode, "readonly ")
                    : undefined;

            context.report({
                messageId: "forbidden",
                node,
                ...(isDefined(fix) && {
                    fix,
                    suggest: [
                        {
                            fix,
                            messageId: "suggestAddReadonly",
                        },
                    ],
                }),
            });
        },
    }),
    meta: {
        deprecated: false,
        docs: {
            deprecated: false,
            description: "require readonly for class and interface properties.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-prefer-readonly-property",
        },
        fixable: "code",
        hasSuggestions: true,
        languages: ["js/js"],
        messages: {
            forbidden: "Prefer readonly property declarations.",
            suggestAddReadonly:
                "Insert readonly modifier for this property declaration.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "typescript/prefer-readonly-property",
});

/** Deprecated rule with explicit lifecycle and replacement metadata. */
const deprecatedRule: typeof rule = withDeprecatedRuleLifecycle(rule, {
    availableUntil: "4.0.0",
    deprecatedSince: "3.0.0",
    message:
        "Deprecated in favor of the type-aware @typescript-eslint/prefer-readonly rule.",
    replacedBy: [
        createReplacementRuleInfo({
            plugin: {
                name: "@typescript-eslint",
                url: "https://typescript-eslint.io/",
            },
            rule: {
                name: "prefer-readonly",
                url: "https://typescript-eslint.io/rules/prefer-readonly/",
            },
        }),
    ],
    ruleId: "typescript/prefer-readonly-property",
});

export default deprecatedRule;
