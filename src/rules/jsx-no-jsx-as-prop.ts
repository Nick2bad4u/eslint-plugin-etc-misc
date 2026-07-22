import { AST_NODE_TYPES } from "@typescript-eslint/utils";

import type {
    JsxPropRuleOption,
    JsxPropRuleOptions,
} from "../_internal/jsx-prop-stability.js";

import { createJsxPropStabilityVisitor } from "../_internal/jsx-prop-stability.js";
import { ruleCreator } from "../_internal/rule-creator.js";
import {
    createReplacementRuleInfo,
    withDeprecatedRuleLifecycle,
} from "../_internal/rule-deprecation.js";

type MessageIds = "unstableJsxProp";

type Options = JsxPropRuleOptions;

const defaultOption: JsxPropRuleOption = { nativeAllowList: "all" };
const defaultOptions: Options = [defaultOption];

/** Disallow render-local JSX allocations used as JSX props. */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context, [options = defaultOption]) =>
        createJsxPropStabilityVisitor({
            context,
            matcher: (expression) =>
                expression.type === AST_NODE_TYPES.JSXElement ||
                expression.type === AST_NODE_TYPES.JSXFragment,
            options,
            report: (node) => {
                context.report({
                    messageId: "unstableJsxProp",
                    node,
                });
            },
        }),
    defaultOptions,
    meta: {
        defaultOptions: [{ nativeAllowList: "all" }],
        deprecated: false,
        docs: {
            deprecated: false,
            description:
                "disallow render-local JSX allocations used as JSX props.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/jsx-no-jsx-as-prop",
        },
        hasSuggestions: false,
        languages: ["js/js"],
        messages: {
            unstableJsxProp:
                "Avoid creating JSX during render when passing it as a prop solely for reference stability; prefer composition or memoize only after measuring.",
        },
        schema: [
            {
                additionalProperties: false,
                description:
                    "Configuration for intrinsic JSX attributes that accept JSX values.",
                properties: {
                    nativeAllowList: {
                        description:
                            "Intrinsic attribute names to ignore, or all intrinsic attributes.",
                        oneOf: [
                            {
                                description:
                                    "Ignore every attribute on intrinsic JSX elements.",
                                enum: ["all"],
                                type: "string",
                            },
                            {
                                description:
                                    "Case-insensitive intrinsic attribute names to ignore.",
                                items: {
                                    description:
                                        "An intrinsic JSX attribute name.",
                                    type: "string",
                                },
                                type: "array",
                                uniqueItems: true,
                            },
                        ],
                    },
                },
                type: "object",
            },
        ],
        type: "suggestion",
    },
    name: "jsx-no-jsx-as-prop",
});

/** Deprecated rule with explicit lifecycle and replacement metadata. */
const deprecatedRule: typeof rule = withDeprecatedRuleLifecycle(rule, {
    availableUntil: "4.0.0",
    deprecatedSince: "3.0.0",
    message:
        "Deprecated because no-unstable-react-values consolidates JSX prop stability checks.",
    replacedBy: [
        createReplacementRuleInfo({
            rule: {
                name: "no-unstable-react-values",
                url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-unstable-react-values",
            },
        }),
    ],
    ruleId: "jsx-no-jsx-as-prop",
});

export default deprecatedRule;
