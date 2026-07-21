import { AST_NODE_TYPES, type TSESTree as es } from "@typescript-eslint/utils";
import { isDefined, setHas } from "ts-extras";

import {
    getEnclosingFunction,
    isComponentOpeningElement,
} from "../_internal/jsx-react-analysis.js";
import { collectUnstableValues } from "../_internal/react-memo-stability.js";
import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "unstableChild";

type Options = readonly [RuleOption?];

type RuleOption = Readonly<{
    readonly strict?: boolean;
}>;

const defaultOptions: Options = [{ strict: false }];

/**
 * Report unstable child values passed to custom components without inserting
 * hooks or guessing dependency arrays.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context, [configuredOption]) => {
        const strict = configuredOption?.strict ?? false;
        const reportedNodes = new Set<Readonly<es.Expression>>();

        return {
            JSXElement: (node: Readonly<es.JSXElement>): void => {
                if (
                    !isComponentOpeningElement(node.openingElement) ||
                    !isDefined(getEnclosingFunction(context.sourceCode, node))
                ) {
                    return;
                }

                for (const child of node.children) {
                    const unstableValues =
                        child.type === AST_NODE_TYPES.JSXElement ||
                        child.type === AST_NODE_TYPES.JSXFragment
                            ? [{ kind: "jsx" as const, node: child }]
                            : child.type ===
                                    AST_NODE_TYPES.JSXExpressionContainer &&
                                child.expression.type !==
                                    AST_NODE_TYPES.JSXEmptyExpression
                              ? collectUnstableValues(
                                    context.sourceCode,
                                    child.expression,
                                    strict
                                )
                              : [];

                    for (const unstableValue of unstableValues) {
                        if (setHas(reportedNodes, unstableValue.node)) {
                            continue;
                        }

                        reportedNodes.add(unstableValue.node);
                        context.report({
                            data: { valueKind: unstableValue.kind },
                            messageId: "unstableChild",
                            node: unstableValue.node,
                        });
                    }
                }
            },
        };
    },
    defaultOptions,
    meta: {
        defaultOptions: [{ strict: false }],
        deprecated: false,
        docs: {
            deprecated: false,
            description:
                "disallow render-local unstable children passed to custom components.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-unstable-react-children",
        },
        hasSuggestions: false,
        languages: ["js/js"],
        messages: {
            unstableChild:
                "This {{valueKind}} child has a new identity on every render; use ordinary composition unless profiling proves stable child identity is required.",
        },
        schema: [
            {
                additionalProperties: false,
                description:
                    "Configuration for classifying unknown child expressions.",
                properties: {
                    strict: {
                        description:
                            "Report calls, member expressions, and tagged templates whose identity cannot be proven stable.",
                        type: "boolean",
                    },
                },
                type: "object",
            },
        ],
        type: "suggestion",
    },
    name: "no-unstable-react-children",
});

export default rule;
