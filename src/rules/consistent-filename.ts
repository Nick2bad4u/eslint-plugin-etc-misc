import { type Casing, filenameStem, toCasing } from "../_internal/casing";
import { ruleCreator } from "../_internal/rule-creator";

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
        docs: {
            description: "enforce filename casing consistency.",
            recommended: false,
            url: "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/consistent-filename.md",
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

export default rule;
