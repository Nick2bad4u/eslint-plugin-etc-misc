import type { TSESTree as es } from "@typescript-eslint/utils";

import { AST_NODE_TYPES } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden";

const internalTagPattern = /@internal\b/v;

const isNonUnderscoreIdentifier = (
    identifier: Readonly<es.Identifier>
): boolean => !identifier.name.startsWith("_");

const isExportDeclaration = (
    node: null | Readonly<es.Node> | undefined
): node is es.ExportDefaultDeclaration | es.ExportNamedDeclaration =>
    node?.type === AST_NODE_TYPES.ExportDefaultDeclaration ||
    node?.type === AST_NODE_TYPES.ExportNamedDeclaration;

/**
 * Enforce underscore prefixes for declarations marked with `@internal`.
 */
const rule: ReturnType<typeof ruleCreator<readonly [], MessageIds>> =
    ruleCreator<readonly [], MessageIds>({
        create: (context) => {
            const hasInternalTag = (node: Readonly<es.Node>): boolean => {
                let commentTargets: readonly es.Node[] = [node];
                if (isExportDeclaration(node.parent)) {
                    commentTargets = [...commentTargets, node.parent];
                }

                return commentTargets.some((commentTarget) =>
                    context.sourceCode
                        .getCommentsBefore(commentTarget)
                        .some((comment) =>
                            internalTagPattern.test(comment.value)
                        )
                );
            };

            const reportIfInternal = (
                nameIdentifier: Readonly<es.Identifier>,
                commentTarget: Readonly<es.Node>
            ): void => {
                if (!isNonUnderscoreIdentifier(nameIdentifier)) {
                    return;
                }

                if (!hasInternalTag(commentTarget)) {
                    return;
                }

                context.report({
                    messageId: "forbidden",
                    node: nameIdentifier,
                });
            };

            return {
                "ClassDeclaration[id.type='Identifier']": (
                    node: Readonly<es.ClassDeclaration>
                ) => {
                    if (node.id === null) {
                        return;
                    }

                    reportIfInternal(node.id, node);
                },
                "FunctionDeclaration[id.type='Identifier']": (
                    node: Readonly<es.FunctionDeclaration>
                ) => {
                    if (node.id === null) {
                        return;
                    }

                    reportIfInternal(node.id, node);
                },
                "MethodDefinition[key.type='Identifier']": (
                    node: Readonly<es.MethodDefinition>
                ) => {
                    if (node.key.type !== AST_NODE_TYPES.Identifier) {
                        return;
                    }

                    reportIfInternal(node.key, node);
                },
                "PropertyDefinition[key.type='Identifier']": (
                    node: Readonly<es.PropertyDefinition>
                ) => {
                    if (node.key.type !== AST_NODE_TYPES.Identifier) {
                        return;
                    }

                    reportIfInternal(node.key, node);
                },
                "TSEnumDeclaration[id.type='Identifier']": (
                    node: Readonly<es.TSEnumDeclaration>
                ) => {
                    reportIfInternal(node.id, node);
                },
                "TSEnumMember[id.type='Identifier']": (
                    node: Readonly<es.TSEnumMember>
                ) => {
                    if (node.id.type !== AST_NODE_TYPES.Identifier) {
                        return;
                    }

                    reportIfInternal(node.id, node);
                },
                "TSInterfaceDeclaration[id.type='Identifier']": (
                    node: Readonly<es.TSInterfaceDeclaration>
                ) => {
                    reportIfInternal(node.id, node);
                },
                "TSMethodSignature[key.type='Identifier']": (
                    node: Readonly<es.TSMethodSignature>
                ) => {
                    if (node.key.type !== AST_NODE_TYPES.Identifier) {
                        return;
                    }

                    reportIfInternal(node.key, node);
                },
                "TSPropertySignature[key.type='Identifier']": (
                    node: Readonly<es.TSPropertySignature>
                ) => {
                    if (node.key.type !== AST_NODE_TYPES.Identifier) {
                        return;
                    }

                    reportIfInternal(node.key, node);
                },
                "TSTypeAliasDeclaration[id.type='Identifier']": (
                    node: Readonly<es.TSTypeAliasDeclaration>
                ) => {
                    reportIfInternal(node.id, node);
                },
                "VariableDeclarator[id.type='Identifier']": (
                    node: Readonly<es.VariableDeclarator>
                ) => {
                    if (node.id.type !== AST_NODE_TYPES.Identifier) {
                        return;
                    }

                    const declaration = node.parent;
                    reportIfInternal(node.id, declaration);
                },
            };
        },
        meta: {
            deprecated: false,
            docs: {
                deprecated: false,
                description:
                    "disallow internal APIs that are not prefixed with underscores.",
                frozen: false,
                recommended: false,
                url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/underscore-internal",
            },
            hasSuggestions: false,
            messages: {
                forbidden:
                    "Internal APIs not prefixed with underscores are forbidden.",
            },
            schema: [],
            type: "problem",
        },
        name: "underscore-internal",
    });

export default rule;
