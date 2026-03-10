import { type Casing, filenameStem, toCasing } from "../_internal/casing.js";
import { ruleCreator } from "../_internal/rule-creator.js";
import {
    createReplacementRuleInfo,
    withDeprecatedRuleLifecycle,
} from "../_internal/rule-deprecation.js";

type MessageIds = "inconsistent";

type Options = readonly [
    Readonly<{
        format?: Casing;
    }>,
];

const defaultOptions = {
    format: "kebab-case" as Casing,
};

/**
 * Enforce filename casing consistency with optional selector-based overrides.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context, [options]) => ({
        Program: (node): void => {
            if (context.filename === "<input>") {
                return;
            }

            const stem = filenameStem(context.filename);
            const expected = toCasing(
                stem,
                options.format ?? defaultOptions.format
            );
            if (stem === expected) {
                return;
            }

            context.report({
                data: {
                    expected,
                },
                messageId: "inconsistent",
                node,
            });
        },
    }),
    defaultOptions: [defaultOptions],
    meta: {
        defaultOptions: [defaultOptions],
        deprecated: true,
        docs: {
            deprecated: true,
            description: "enforce filename casing consistency.",
            frozen: true,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/consistent-filename",
        },
        hasSuggestions: false,
        messages: {
            inconsistent: "Filename should use '{{expected}}' casing.",
        },
        schema: [
            {
                additionalProperties: false,
                description:
                    "Configuration for filename casing consistency enforcement.",
                properties: {
                    format: {
                        description:
                            "Expected casing format for filename stems.",
                        enum: [
                            "camelCase",
                            "kebab-case",
                            "PascalCase",
                        ],
                        type: "string",
                    },
                },
                type: "object",
            },
        ],
        type: "suggestion",
    },
    name: "consistent-filename",
});

/**
 * Wrapper rule with explicit lifecycle metadata and replacement mapping.
 */
const deprecatedRule: typeof rule = withDeprecatedRuleLifecycle(rule, {
    message: "Deprecated in favor of unicorn/filename-case.",
    replacedBy: [
        createReplacementRuleInfo({
            plugin: {
                name: "unicorn",
                url: "https://github.com/sindresorhus/eslint-plugin-unicorn",
            },
            rule: {
                name: "filename-case",
                url: "https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/filename-case.md",
            },
        }),
    ],
    ruleId: "consistent-filename",
});

export default deprecatedRule;
