import { ruleCreator } from "../_internal/rule-creator.js";
import {
    createReplacementRuleInfo,
    withDeprecatedRuleLifecycle,
} from "../_internal/rule-deprecation.js";
import {
    buildRestrictedSyntaxListeners,
    normalizeSyntaxSelector,
    type SyntaxSelectorOption,
} from "../_internal/syntax-selectors.js";

type MessageIds = "customMessage" | "forbidden";

type Options = readonly [
    Readonly<{
        selectors?: readonly SyntaxSelectorOption[];
    }>,
];

/**
 * Disallow syntax nodes matched by configured selectors.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context, [options]) => {
        const selectors = options.selectors ?? [];
        const entries = selectors.map((selector) =>
            normalizeSyntaxSelector(selector)
        );

        return buildRestrictedSyntaxListeners(entries, (node, entry) => {
            if (entry.message !== undefined) {
                context.report({
                    data: {
                        message: entry.message,
                    },
                    messageId: "customMessage",
                    node,
                });
                return;
            }

            context.report({
                messageId: "forbidden",
                node,
            });
        });
    },
    defaultOptions: [{ selectors: [] }],
    meta: {
        defaultOptions: [{ selectors: [] }],
        docs: {
            description:
                "disallow syntax nodes selected by configured AST selectors.",
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-restricted-syntax",
        },
        hasSuggestions: false,
        messages: {
            customMessage: "{{message}}",
            forbidden: "Disallowed syntax.",
        },
        schema: [
            {
                additionalProperties: false,
                description: "Configuration for syntax selectors to disallow.",
                properties: {
                    selectors: {
                        description:
                            "Selector list. Each entry can be a selector string or a selector/message object.",
                        items: {
                            oneOf: [
                                {
                                    minLength: 1,
                                    type: "string",
                                },
                                {
                                    additionalProperties: false,
                                    properties: {
                                        message: {
                                            minLength: 1,
                                            type: "string",
                                        },
                                        selector: {
                                            minLength: 1,
                                            type: "string",
                                        },
                                    },
                                    required: ["selector"],
                                    type: "object",
                                },
                            ],
                        },
                        type: "array",
                    },
                },
                type: "object",
            },
        ],
        type: "problem",
    },
    name: "no-restricted-syntax",
});

/**
 * Wrapper rule with explicit lifecycle metadata and replacement mapping.
 */
const deprecatedRule: typeof rule = withDeprecatedRuleLifecycle(rule, {
    message: "Deprecated in favor of ESLint core no-restricted-syntax.",
    replacedBy: [
        createReplacementRuleInfo({
            rule: {
                name: "no-restricted-syntax",
                url: "https://eslint.org/docs/latest/rules/no-restricted-syntax",
            },
        }),
    ],
    ruleId: "no-restricted-syntax",
});

export default deprecatedRule;
