import type { TSESTree as es } from "@typescript-eslint/utils";

import { resolve } from "node:path";

import { type Casing, filenameStem, toCasing } from "../_internal/casing.js";
import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "onlyExport";

type Options = readonly [
    Readonly<{
        readonly format?: Casing;
    }>,
];

const exportedNamesFromDeclaration = (
    node: Readonly<es.ExportNamedDeclaration>
): readonly string[] => {
    if (node.specifiers.length > 0) {
        return node.specifiers
            .filter(
                (specifier): specifier is es.ExportSpecifier =>
                    specifier.type === "ExportSpecifier"
            )
            .flatMap((specifier) =>
                specifier.exported.type === "Identifier"
                    ? [specifier.exported.name]
                    : []
            );
    }

    if (
        node.declaration?.type === "ClassDeclaration" ||
        node.declaration?.type === "FunctionDeclaration"
    ) {
        return node.declaration.id === null ? [] : [node.declaration.id.name];
    }

    return [];
};

/**
 * Enforce that exports matching the filename are the only export in the file.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context, [options]) => {
        let exports: readonly {
            readonly name: string;
            readonly node: es.Node;
        }[] = [];

        return {
            ExportDefaultDeclaration: (
                node: Readonly<es.ExportDefaultDeclaration>
            ): void => {
                exports = [
                    ...exports,
                    {
                        name: "default",
                        node,
                    },
                ];
            },
            ExportNamedDeclaration: (
                node: Readonly<es.ExportNamedDeclaration>
            ): void => {
                for (const name of exportedNamesFromDeclaration(node)) {
                    exports = [...exports, { name, node }];
                }
            },
            "Program:exit": (): void => {
                if (context.filename === "<input>") {
                    return;
                }

                const stem = filenameStem(resolve(context.filename));
                const expected = toCasing(stem, options.format ?? "PascalCase");
                const matching = exports.filter(
                    (entry) => entry.name === expected
                );
                if (matching.length === 0 || exports.length <= 1) {
                    return;
                }

                for (const entry of exports) {
                    if (entry.name === expected) {
                        continue;
                    }

                    context.report({
                        data: {
                            expected,
                        },
                        messageId: "onlyExport",
                        node: entry.node,
                    });
                }
            },
        };
    },
    defaultOptions: [{ format: "PascalCase" }],
    meta: {
        defaultOptions: [{ format: "PascalCase" }],
        deprecated: false,
        docs: {
            deprecated: false,
            description:
                "enforce filename-matching exports to be the only export.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/export-matching-filename-only",
        },
        hasSuggestions: false,
        messages: {
            onlyExport:
                "When exporting '{{expected}}', it must be the only export in this file.",
        },
        schema: [
            {
                additionalProperties: false,
                description:
                    "Configuration for filename-matching export exclusivity checks.",
                properties: {
                    format: {
                        description:
                            "Casing format used to derive expected export name from filename.",
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
    name: "export-matching-filename-only",
});

export default rule;
