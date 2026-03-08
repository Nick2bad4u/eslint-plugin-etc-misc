import type {
    TSESTree as es,
} from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator";

type MessageIds = "forbidden";

type Options = readonly [];

const isNode = (value: unknown): value is Readonly<es.Node> =>
    typeof value === "object" && value !== null && "type" in value;

const containsThisExpression = (root: Readonly<es.Node>): boolean => {
    const stack: es.Node[] = [root];
    const enqueue = (value: unknown): void => {
        if (isNode(value)) {
            stack.push(value);
        }
    };

    while (stack.length > 0) {
        const node = stack.pop();
        if (node === undefined) {
            continue;
        }

        if (node.type === "ThisExpression") {
            return true;
        }

        for (const [key, child] of Object.entries(node)) {
            if (key === "loc" || key === "parent" || key === "range") {
                continue;
            }

            if (Array.isArray(child)) {
                for (const item of child) {
                    enqueue(item);
                }
            } else {
                enqueue(child);
            }
        }
    }

    return false;
};

const hasThisParameter = (node: Readonly<es.MethodDefinition>): boolean => {
    const [firstParameter] = node.value.params;

    return firstParameter?.type === "Identifier" && firstParameter.name === "this";
};

const usesThisExpression = (node: Readonly<es.MethodDefinition>): boolean =>
    node.value.body === null ? false : containsThisExpression(node.value.body);

/**
 * Require non-static class methods to reference `this`.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> =
    ruleCreator<Options, MessageIds>({
        create: (context) => ({
            MethodDefinition: (node: Readonly<es.MethodDefinition>): void => {
                if (
                    node.kind !== "method" ||
                    node.static ||
                    node.value.body === null ||
                    hasThisParameter(node) ||
                    usesThisExpression(node)
                ) {
                    return;
                }

                context.report({
                    messageId: "forbidden",
                    node,
                });
            },
        }),
        defaultOptions: [],
        meta: {
            docs: {
                description: "require non-static class methods to reference `this`.",
                recommended: false,
                url: "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/typescript-class-methods-use-this.md",
            },
            hasSuggestions: false,
            messages: {
                forbidden: "Class method should use `this` or declare a `this` parameter.",
            },
            schema: [],
            type: "suggestion",
        },
        name: "typescript/class-methods-use-this",
    });

export default rule;
