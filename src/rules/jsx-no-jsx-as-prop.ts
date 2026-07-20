import { AST_NODE_TYPES } from "@typescript-eslint/utils";

import type { JsxPropRuleOptions } from "../_internal/jsx-prop-stability.js";

import { createJsxPropStabilityVisitor } from "../_internal/jsx-prop-stability.js";
import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "unstableJsxProp";

type Options = JsxPropRuleOptions;

const defaultOptions: Options = [{}];

/** Disallow render-local JSX allocations used as JSX props. */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context, [options = {}]) =>
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
        defaultOptions: [{}],
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

export default rule;
