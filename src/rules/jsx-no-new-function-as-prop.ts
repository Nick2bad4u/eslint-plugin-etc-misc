import { AST_NODE_TYPES } from "@typescript-eslint/utils";

import type {
    JsxPropRuleOption,
    JsxPropRuleOptions,
} from "../_internal/jsx-prop-stability.js";

import {
    createJsxPropStabilityVisitor,
    isBindCall,
    isBuiltinAllocation,
} from "../_internal/jsx-prop-stability.js";
import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "unstableFunctionProp";

type Options = JsxPropRuleOptions;

const defaultOption: JsxPropRuleOption = { nativeAllowList: "all" };
const defaultOptions: Options = [defaultOption];

/** Disallow render-local function allocations used as JSX props. */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context, [options = defaultOption]) =>
        createJsxPropStabilityVisitor({
            context,
            matcher: (expression, sourceCode) =>
                expression.type === AST_NODE_TYPES.ArrowFunctionExpression ||
                expression.type === AST_NODE_TYPES.FunctionExpression ||
                isBindCall(expression) ||
                isBuiltinAllocation(expression, sourceCode, "Function"),
            options,
            report: (node) => {
                context.report({
                    messageId: "unstableFunctionProp",
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
                "disallow render-local function allocations used as JSX props.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/jsx-no-new-function-as-prop",
        },
        hasSuggestions: false,
        languages: ["js/js"],
        messages: {
            unstableFunctionProp:
                "Avoid creating this function during render when passing it as a prop; use a stable callback only when identity affects rendering or an API contract.",
        },
        schema: [
            {
                additionalProperties: false,
                description:
                    "Configuration for intrinsic JSX attributes that accept function values.",
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
    name: "jsx-no-new-function-as-prop",
});

export default rule;
