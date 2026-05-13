import type { TSESTree as es } from "@typescript-eslint/utils";

import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import { arrayAt, objectEntries, objectHasOwn } from "ts-extras";

import { ruleCreator } from "../_internal/rule-creator.js";
import {
    createReplacementRuleInfo,
    withDeprecatedRuleLifecycle,
} from "../_internal/rule-deprecation.js";

type MessageIds = "forbidden";

type Options = readonly [];

const isNode = (value: unknown): value is Readonly<es.Node> =>
    typeof value === "object" && value !== null && objectHasOwn(value, "type");

const collectNodeChildren = (
    node: Readonly<es.Node>
): readonly Readonly<es.Node>[] => {
    let children: readonly Readonly<es.Node>[] = [];

    const addNode = (value: unknown): void => {
        if (isNode(value)) {
            children = [...children, value];
        }
    };

    for (const [key, child] of objectEntries(node)) {
        if (key === "loc" || key === "parent" || key === "range") {
            continue;
        }

        if (Array.isArray(child)) {
            for (const item of child) {
                addNode(item);
            }
            continue;
        }

        addNode(child);
    }

    return children;
};

const containsThisExpression = (root: Readonly<es.Node>): boolean => {
    let stack: readonly es.Node[] = [root];

    while (stack.length > 0) {
        const node = arrayAt(stack, -1);
        stack = stack.slice(0, -1);
        if (node === undefined) {
            continue;
        }

        if (node.type === AST_NODE_TYPES.ThisExpression) {
            return true;
        }

        stack = [...stack, ...collectNodeChildren(node)];
    }

    return false;
};

const hasThisParameter = (node: Readonly<es.MethodDefinition>): boolean => {
    const [firstParameter] = node.value.params;

    return (
        firstParameter?.type === AST_NODE_TYPES.Identifier &&
        firstParameter.name === "this"
    );
};

const usesThisExpression = (node: Readonly<es.MethodDefinition>): boolean =>
    node.value.body === null ? false : containsThisExpression(node.value.body);

const shouldSkipMethod = (node: Readonly<es.MethodDefinition>): boolean =>
    node.kind !== "method" ||
    node.static ||
    node.value.body === null ||
    hasThisParameter(node) ||
    usesThisExpression(node);

/**
 * Require non-static class methods to reference `this`.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => ({
        MethodDefinition: (node: Readonly<es.MethodDefinition>): void => {
            if (shouldSkipMethod(node)) {
                return;
            }

            context.report({
                messageId: "forbidden",
                node,
            });
        },
    }),
    meta: {
        deprecated: true,
        docs: {
            deprecated: true,
            description:
                "require non-static class methods to reference `this`.",
            frozen: true,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-class-methods-use-this",
        },
        hasSuggestions: false,
        messages: {
            forbidden:
                "Class method should use `this` or declare a `this` parameter.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "typescript/class-methods-use-this",
});

/**
 * Wrapper rule with explicit lifecycle metadata and replacement mapping.
 */
const deprecatedRule: typeof rule = withDeprecatedRuleLifecycle(rule, {
    message:
        "Deprecated in favor of @typescript-eslint/class-methods-use-this.",
    replacedBy: [
        createReplacementRuleInfo({
            plugin: {
                name: "@typescript-eslint",
                url: "https://typescript-eslint.io/",
            },
            rule: {
                name: "class-methods-use-this",
                url: "https://typescript-eslint.io/rules/class-methods-use-this",
            },
        }),
    ],
    ruleId: "typescript/class-methods-use-this",
});

export default deprecatedRule;
