import type { TSESTree as es } from "@typescript-eslint/utils";

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
    // eslint-disable-next-line unicorn/prefer-at -- Node >=16.0 support baseline
    const lastStatement = node.consequent[node.consequent.length - 1];
    if (firstStatement === undefined || lastStatement === undefined) {
        return true;
    }

    const startsOnFollowingLine =
        firstStatement.loc.start.line > node.loc.start.line;
    const startsWithBlock = firstStatement.type === "BlockStatement";
    const endsWithBreak =
        lastStatement.type === "BreakStatement" || startsWithBlock;

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
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "enforce consistent spacing and break placement in switch cases.",
            recommended: false,
            url: "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/switch-case-spacing.md",
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
