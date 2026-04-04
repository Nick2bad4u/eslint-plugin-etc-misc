import type { TSESTree as es } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";
import {
    createReplacementRuleInfo,
    withDeprecatedRuleLifecycle,
} from "../_internal/rule-deprecation.js";

type MessageIds = "forbidden";

type Options = readonly [];

/**
 * Disallow empty interfaces without extends clauses.
 */
const selector =
    "TSInterfaceDeclaration[body.body.length=0][extends.length=0] > Identifier.id";
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => ({
        [selector]: (node: Readonly<es.Node>): void => {
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
            description: "disallow empty interfaces without extends clauses.",
            frozen: true,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-no-empty-interfaces",
        },
        hasSuggestions: false,
        messages: {
            forbidden: "Empty interface is not allowed.",
        },
        schema: [],
        type: "problem",
    },
    name: "typescript/no-empty-interfaces",
});

/**
 * Wrapper rule with explicit lifecycle metadata and replacement mapping.
 */
const deprecatedRule: typeof rule = withDeprecatedRuleLifecycle(rule, {
    message: "Deprecated in favor of @typescript-eslint/no-empty-object-type.",
    replacedBy: [
        createReplacementRuleInfo({
            plugin: {
                name: "@typescript-eslint",
                url: "https://typescript-eslint.io/",
            },
            rule: {
                name: "no-empty-object-type",
                url: "https://typescript-eslint.io/rules/no-empty-object-type",
            },
        }),
    ],
    ruleId: "typescript/no-empty-interfaces",
});

export default deprecatedRule;
