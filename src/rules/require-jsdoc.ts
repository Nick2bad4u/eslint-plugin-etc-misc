import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

import { AST_NODE_TYPES, AST_TOKEN_TYPES } from "@typescript-eslint/utils";
import { arrayLast, setHas } from "ts-extras";

import { ruleCreator } from "../_internal/rule-creator.js";
import {
    createReplacementRuleInfo,
    withDeprecatedRuleLifecycle,
} from "../_internal/rule-deprecation.js";

type JSDocKind =
    | "arrow-function"
    | "class"
    | "function"
    | "method"
    | "type";

type MessageIds = "missing";

type Options = readonly [
    Readonly<{
        readonly kinds?: readonly JSDocKind[];
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

    const comment = arrayLast(comments);
    return (
        comment?.type === AST_TOKEN_TYPES.Block && comment.value.startsWith("*")
    );
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
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context, [options]) => {
        const kinds = new Set(options.kinds ?? defaultKinds);

        return {
            ClassDeclaration: (node: Readonly<es.ClassDeclaration>): void => {
                if (!setHas(kinds, "class") || node.id === null) {
                    return;
                }

                reportMissingJSDoc(context, node);
            },
            FunctionDeclaration: (
                node: Readonly<es.FunctionDeclaration>
            ): void => {
                if (!setHas(kinds, "function") || node.id === null) {
                    return;
                }

                reportMissingJSDoc(context, node);
            },
            MethodDefinition: (node: Readonly<es.MethodDefinition>): void => {
                if (
                    !setHas(kinds, "method") ||
                    node.kind === "constructor" ||
                    node.key.type !== AST_NODE_TYPES.Identifier
                ) {
                    return;
                }

                reportMissingJSDoc(context, node);
            },
            "TSTypeAliasDeclaration, TSInterfaceDeclaration": (
                node: Readonly<es.Node>
            ): void => {
                if (!setHas(kinds, "type")) {
                    return;
                }

                if (
                    node.type === AST_NODE_TYPES.TSInterfaceDeclaration ||
                    node.type === AST_NODE_TYPES.TSTypeAliasDeclaration
                ) {
                    reportMissingJSDoc(context, node);
                }
            },
            VariableDeclarator: (
                node: Readonly<es.VariableDeclarator>
            ): void => {
                if (
                    !setHas(kinds, "arrow-function") ||
                    node.id.type !== AST_NODE_TYPES.Identifier ||
                    node.init?.type !==
                        AST_NODE_TYPES.ArrowFunctionExpression ||
                    node.parent.kind !== "const"
                ) {
                    return;
                }

                reportMissingJSDoc(context, node.parent);
            },
        };
    },
    meta: {
        defaultOptions: [{ kinds: defaultKinds }],
        deprecated: true,
        docs: {
            deprecated: true,
            description:
                "require JSDoc comments for configured declaration kinds.",
            frozen: true,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/require-jsdoc",
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

/**
 * Wrapper rule with explicit lifecycle metadata and replacement mapping.
 */
const deprecatedRule: typeof rule = withDeprecatedRuleLifecycle(rule, {
    message: "Deprecated in favor of jsdoc/require-jsdoc.",
    replacedBy: [
        createReplacementRuleInfo({
            plugin: {
                name: "jsdoc",
                url: "https://github.com/gajus/eslint-plugin-jsdoc",
            },
            rule: {
                name: "require-jsdoc",
                url: "https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules/require-jsdoc.md",
            },
        }),
    ],
    ruleId: "require-jsdoc",
});

export default deprecatedRule;
