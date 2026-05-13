import type { TSESTree as es } from "@typescript-eslint/utils";

import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import { arrayLast } from "ts-extras";

import { ruleCreator } from "../_internal/rule-creator.js";
import {
    createReplacementRuleInfo,
    withDeprecatedRuleLifecycle,
} from "../_internal/rule-deprecation.js";

type MessageIds = "forbidden";

type Options = readonly [];

const isValidCaseBody = (node: Readonly<es.SwitchCase>): boolean => {
    if (node.consequent.length === 0) {
        return true;
    }

    const [firstStatement] = node.consequent;
    const lastStatement = arrayLast(node.consequent);
    if (firstStatement === undefined || lastStatement === undefined) {
        return true;
    }

    const startsOnFollowingLine =
        firstStatement.loc.start.line > node.loc.start.line;
    const startsWithBlock =
        firstStatement.type === AST_NODE_TYPES.BlockStatement;
    const endsWithBreak =
        lastStatement.type === AST_NODE_TYPES.BreakStatement || startsWithBlock;

    return (startsOnFollowingLine || startsWithBlock) && endsWithBreak;
};

/**
 * Enforce consistent spacing and break placement inside switch cases.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => ({
        SwitchCase: (node: Readonly<es.SwitchCase>): void => {
            if (isValidCaseBody(node)) {
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
                "enforce consistent spacing and break placement in switch cases.",
            frozen: true,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/switch-case-spacing",
        },
        hasSuggestions: false,
        messages: {
            forbidden:
                "Case body should start on a new line and end with break.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "switch-case-spacing",
});

/**
 * Wrapper rule with explicit lifecycle metadata and replacement mapping.
 */
const deprecatedRule: typeof rule = withDeprecatedRuleLifecycle(rule, {
    message: "Deprecated in favor of @stylistic/switch-colon-spacing.",
    replacedBy: [
        createReplacementRuleInfo({
            plugin: {
                name: "@stylistic",
                url: "https://eslint.style/",
            },
            rule: {
                name: "switch-colon-spacing",
                url: "https://eslint.style/rules/switch-colon-spacing",
            },
        }),
    ],
    ruleId: "switch-case-spacing",
});

export default deprecatedRule;
