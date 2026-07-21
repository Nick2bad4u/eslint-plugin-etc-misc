import type { TSESTree as es } from "@typescript-eslint/utils";

import { arrayJoin } from "ts-extras";

import { ruleCreator } from "../_internal/rule-creator.js";
import {
    createReplacementRuleInfo,
    withDeprecatedRuleLifecycle,
} from "../_internal/rule-deprecation.js";

type MessageIds = "forbidden";

type Options = readonly [];

const selector = arrayJoin(
    [
        "PropertyDefinition[value.type='Literal'] > TSTypeAnnotation",
        "VariableDeclarator[init.type='Literal'] > Identifier.id > TSTypeAnnotation",
    ],
    ", "
);

/**
 * Disallow explicit primitive type annotations when they are inferrable.
 */
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
            description:
                "disallow explicit primitive type annotations when they are inferrable from literals.",
            frozen: true,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-no-inferrable-types",
        },
        hasSuggestions: false,
        languages: ["js/js"],
        messages: {
            forbidden:
                "Type annotation can be inferred from the assigned literal value.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "typescript/no-inferrable-types",
});

/**
 * Wrapper rule with explicit lifecycle metadata and replacement mapping.
 */
const deprecatedRule: typeof rule = withDeprecatedRuleLifecycle(rule, {
    message: "Deprecated in favor of @typescript-eslint/no-inferrable-types.",
    replacedBy: [
        createReplacementRuleInfo({
            plugin: {
                name: "@typescript-eslint",
                url: "https://typescript-eslint.io/",
            },
            rule: {
                name: "no-inferrable-types",
                url: "https://typescript-eslint.io/rules/no-inferrable-types",
            },
        }),
    ],
    ruleId: "typescript/no-inferrable-types",
});

export default deprecatedRule;
