import { AST_NODE_TYPES } from "@typescript-eslint/utils";

import type { JsxPropRuleOptions } from "../_internal/jsx-prop-stability.js";

import {
    createJsxPropStabilityVisitor,
    isBuiltinAllocation,
} from "../_internal/jsx-prop-stability.js";
import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "unstableObjectProp";

type Options = JsxPropRuleOptions;

const defaultOptions: Options = [{}];

/** Disallow render-local object allocations used as JSX props. */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context, [options = {}]) =>
        createJsxPropStabilityVisitor({
            context,
            matcher: (expression, sourceCode) =>
                expression.type === AST_NODE_TYPES.ObjectExpression ||
                isBuiltinAllocation(expression, sourceCode, "Object"),
            options,
            report: (node) => {
                context.report({
                    messageId: "unstableObjectProp",
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
                "disallow render-local object allocations used as JSX props.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/jsx-no-new-object-as-prop",
        },
        hasSuggestions: false,
        messages: {
            unstableObjectProp:
                "Avoid creating this object during render when passing it as a prop; lift it or memoize it only when stable identity is required.",
        },
        schema: [
            {
                additionalProperties: false,
                description:
                    "Configuration for intrinsic JSX attributes that accept object values.",
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
    name: "jsx-no-new-object-as-prop",
});

export default rule;
