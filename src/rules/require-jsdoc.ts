import type {
    TSESTree as es,
    TSESLint,
} from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator";

type JSDocKind = "arrow-function" | "class" | "function" | "method" | "type";

type MessageIds = "missing";

type Options = readonly [
    Readonly<{
        kinds?: readonly JSDocKind[];
    }>,
];

const defaultKinds: readonly JSDocKind[] = [
    "arrow-function",
    "class",
    "function",
    "method",
    "type",
];

type RuleContext = TSESLint.RuleContext<MessageIds, Options>;

type SourceCode = TSESLint.SourceCode;

const hasJSDocComment = (
    sourceCode: Readonly<SourceCode>,
    node: Readonly<es.Node>
): boolean => {
    const comments = sourceCode.getCommentsBefore(node);
    // eslint-disable-next-line unicorn/prefer-at -- Node >=16.0 support baseline
    const comment = comments[comments.length - 1];

    return comment?.type === "Block" && comment.value.startsWith("*");
};

const reportMissingJSDoc = (
    context: Readonly<RuleContext>,
    node: Readonly<es.Node>
): void => {
    if (hasJSDocComment(context.sourceCode, node)) {
        return;
    }

    context.report({
        messageId: "missing",
        node,
    });
};

/**
 * Require JSDoc comments for configured declaration kinds.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> =
    ruleCreator<Options, MessageIds>({
        create: (context, [options]) => {
            const kinds = new Set(options.kinds ?? defaultKinds);

            return {
                ClassDeclaration: (node: Readonly<es.ClassDeclaration>): void => {
                    if (!kinds.has("class") || node.id === null) {
                        return;
                    }

                    reportMissingJSDoc(context, node.id);
                },
                FunctionDeclaration: (node: Readonly<es.FunctionDeclaration>): void => {
                    if (!kinds.has("function") || node.id === null) {
                        return;
                    }

                    reportMissingJSDoc(context, node.id);
                },
                MethodDefinition: (node: Readonly<es.MethodDefinition>): void => {
                    if (
                        !kinds.has("method") ||
                        node.kind === "constructor" ||
                        node.key.type !== "Identifier"
                    ) {
                        return;
                    }

                    reportMissingJSDoc(context, node.key);
                },
                "TSTypeAliasDeclaration, TSInterfaceDeclaration": (
                    node: Readonly<es.Node>
                ): void => {
                    if (!kinds.has("type")) {
                        return;
                    }

                    if (
                        node.type === "TSInterfaceDeclaration" ||
                        node.type === "TSTypeAliasDeclaration"
                    ) {
                        reportMissingJSDoc(context, node.id);
                    }
                },
                VariableDeclarator: (node: Readonly<es.VariableDeclarator>): void => {
                    if (
                        !kinds.has("arrow-function") ||
                        node.id.type !== "Identifier" ||
                        node.init?.type !== "ArrowFunctionExpression" ||
                        node.parent.type !== "VariableDeclaration" ||
                        node.parent.kind !== "const"
                    ) {
                        return;
                    }

                    reportMissingJSDoc(context, node.id);
                },
            };
        },
        defaultOptions: [{ kinds: defaultKinds }],
        meta: {
            defaultOptions: [{ kinds: defaultKinds }],
            docs: {
                description: "require JSDoc comments for configured declaration kinds.",
                recommended: false,
                url: "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/require-jsdoc.md",
            },
            hasSuggestions: false,
            messages: {
                missing: "Missing JSDoc comment.",
            },
            schema: [
                {
                    additionalProperties: false,
                    description:
                        "Configuration for declaration kinds that require JSDoc.",
                    properties: {
                        kinds: {
                            description:
                                "Declaration kinds that must have a leading JSDoc comment.",
                            items: {
                                enum: [...defaultKinds],
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
        name: "require-jsdoc",
    });

export default rule;
