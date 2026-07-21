import { AST_NODE_TYPES } from "@typescript-eslint/utils";

import type {
    JsxPropRuleOption,
    JsxPropRuleOptions,
} from "../_internal/jsx-prop-stability.js";

import {
    createJsxPropStabilityVisitor,
    isBuiltinAllocation,
} from "../_internal/jsx-prop-stability.js";
import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "unstableArrayProp";

type Options = JsxPropRuleOptions;

const defaultOption: JsxPropRuleOption = { nativeAllowList: "all" };
const defaultOptions: Options = [defaultOption];

/** Disallow render-local array allocations used as JSX props. */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context, [options = defaultOption]) =>
        createJsxPropStabilityVisitor({
            context,
            matcher: (expression, sourceCode) =>
                expression.type === AST_NODE_TYPES.ArrayExpression ||
                isBuiltinAllocation(expression, sourceCode, "Array"),
            options,
            report: (node) => {
                context.report({
                    messageId: "unstableArrayProp",
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
                "disallow render-local array allocations used as JSX props.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/jsx-no-new-array-as-prop",
        },
        hasSuggestions: false,
        languages: ["js/js"],
        messages: {
            unstableArrayProp:
                "Avoid creating this array during render when passing it as a prop; lift it or memoize it only when stable identity is required.",
        },
        schema: [
            {
                additionalProperties: false,
                description:
                    "Configuration for intrinsic JSX attributes that accept array values.",
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
    name: "jsx-no-new-array-as-prop",
});

export default rule;
