import type { TSESTree as es } from "@typescript-eslint/utils";

import { setHas } from "ts-extras";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden";

type Options = readonly [
    Readonly<{
        readonly names?: readonly string[];
    }>,
];

const getExportedNames = (
    node: Readonly<es.ExportNamedDeclaration>
): readonly string[] => {
    if (node.specifiers.length > 0) {
        return node.specifiers
            .filter(
                (specifier): specifier is es.ExportSpecifier =>
                    specifier.type === "ExportSpecifier"
            )
            .flatMap((specifier) => {
                if (specifier.exported.type === "Identifier") {
                    return [specifier.exported.name];
                }

                return [];
            });
    }

    const declaration = node.declaration;
    if (declaration === null) {
        return [];
    }

    if (
        declaration.type === "FunctionDeclaration" ||
        declaration.type === "ClassDeclaration"
    ) {
        return declaration.id === null ? [] : [declaration.id.name];
    }

    if (declaration.type === "VariableDeclaration") {
        let names: readonly string[] = [];

        for (const declarator of declaration.declarations) {
            if (declarator.id.type === "Identifier") {
                names = [...names, declarator.id.name];
            }
        }

        return names;
    }

    return [];
};

/**
 * Restrict exported names to a configured allow-list.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context, [options]) => {
        const allowedNames = new Set(options.names ?? ["default"]);

        return {
            ExportDefaultDeclaration: (
                node: Readonly<es.ExportDefaultDeclaration>
            ): void => {
                if (setHas(allowedNames, "default")) {
                    return;
                }

                context.report({
                    data: {
                        name: "default",
                    },
                    messageId: "forbidden",
                    node,
                });
            },
            ExportNamedDeclaration: (
                node: Readonly<es.ExportNamedDeclaration>
            ): void => {
                const exportedNames = getExportedNames(node);
                for (const name of exportedNames) {
                    if (setHas(allowedNames, name)) {
                        continue;
                    }

                    context.report({
                        data: {
                            name,
                        },
                        messageId: "forbidden",
                        node,
                    });

                    return;
                }
            },
        };
    },
    meta: {
        defaultOptions: [{ names: ["default"] }],
        deprecated: false,
        docs: {
            deprecated: false,
            description:
                "disallow exported names that are not in a configured allow-list.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/only-export-name",
        },
        hasSuggestions: false,
        messages: {
            forbidden: "Export '{{name}}' is not allowed by only-export-name.",
        },
        schema: [
            {
                additionalProperties: false,
                description: "Configuration for the export name allow-list.",
                properties: {
                    names: {
                        description:
                            "Allowed export names. Default is ['default'].",
                        items: {
                            minLength: 1,
                            type: "string",
                        },
                        type: "array",
                    },
                },
                type: "object",
            },
        ],
        type: "suggestion",
    },
    name: "only-export-name",
});

export default rule;
