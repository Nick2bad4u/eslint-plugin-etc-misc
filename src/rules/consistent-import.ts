import type { TSESTree as es } from "@typescript-eslint/utils";

import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import { isDefined } from "ts-extras";

import { ruleCreator } from "../_internal/rule-creator.js";

type ImportStyle = "default" | "mixed" | "named" | "namespace" | "side-effect";

type MessageIds = "inconsistent";

type Options = readonly [
    Readonly<{
        readonly style?: ImportStyle;
    }>,
];

const styleFromImport = (node: Readonly<es.ImportDeclaration>): ImportStyle => {
    if (node.specifiers.length === 0) {
        return "side-effect";
    }

    const hasDefault = node.specifiers.some(
        (specifier) => specifier.type === AST_NODE_TYPES.ImportDefaultSpecifier
    );
    const hasNamed = node.specifiers.some(
        (specifier) => specifier.type === AST_NODE_TYPES.ImportSpecifier
    );
    const hasNamespace = node.specifiers.some(
        (specifier) =>
            specifier.type === AST_NODE_TYPES.ImportNamespaceSpecifier
    );

    if (hasNamespace) {
        return "namespace";
    }

    if (hasDefault && hasNamed) {
        return "mixed";
    }

    if (hasDefault) {
        return "default";
    }

    return "named";
};

/**
 * Enforce consistent import declaration style per module source.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context, [options]) => {
        const seen = new Map<string, ImportStyle>();

        return {
            ImportDeclaration: (node: Readonly<es.ImportDeclaration>): void => {
                if (typeof node.source.value !== "string") {
                    return;
                }

                const source = node.source.value;
                const style = styleFromImport(node);
                const expected = options.style ?? seen.get(source) ?? style;
                if (!isDefined(options.style)) {
                    seen.set(source, expected);
                }

                if (style === expected) {
                    return;
                }

                context.report({
                    data: {
                        expected,
                        source,
                    },
                    messageId: "inconsistent",
                    node,
                });
            },
        };
    },
    meta: {
        defaultOptions: [{}],
        deprecated: false,
        docs: {
            deprecated: false,
            description:
                "enforce consistent import declaration style per module source.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/consistent-import",
        },
        hasSuggestions: false,
        messages: {
            inconsistent:
                "Imports from '{{source}}' should use '{{expected}}' style consistently.",
        },
        schema: [
            {
                additionalProperties: false,
                description:
                    "Configuration for global import declaration style enforcement.",
                properties: {
                    style: {
                        description:
                            "When provided, all imports must use this style.",
                        enum: [
                            "default",
                            "mixed",
                            "named",
                            "namespace",
                            "side-effect",
                        ],
                        type: "string",
                    },
                },
                type: "object",
            },
        ],
        type: "suggestion",
    },
    name: "consistent-import",
});

export default rule;
