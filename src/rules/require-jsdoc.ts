import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";
import {
    createReplacementRuleInfo,
    withDeprecatedRuleLifecycle,
} from "../_internal/rule-deprecation.js";

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
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context, [options]) => {
        const kinds = new Set(options.kinds ?? defaultKinds);

        return {
            ClassDeclaration: (node: Readonly<es.ClassDeclaration>): void => {
                if (!kinds.has("class") || node.id === null) {
                    return;
                }

                reportMissingJSDoc(context, node);
            },
            FunctionDeclaration: (
                node: Readonly<es.FunctionDeclaration>
            ): void => {
                if (!kinds.has("function") || node.id === null) {
                    return;
                }

                reportMissingJSDoc(context, node);
            },
            MethodDefinition: (node: Readonly<es.MethodDefinition>): void => {
                if (
                    !kinds.has("method") ||
                    node.kind === "constructor" ||
                    node.key.type !== "Identifier"
                ) {
                    return;
                }

                reportMissingJSDoc(context, node);
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
                    reportMissingJSDoc(context, node);
                }
            },
            VariableDeclarator: (
                node: Readonly<es.VariableDeclarator>
            ): void => {
                if (
                    !kinds.has("arrow-function") ||
                    node.id.type !== "Identifier" ||
                    node.init?.type !== "ArrowFunctionExpression" ||
                    node.parent.type !== "VariableDeclaration" ||
                    node.parent.kind !== "const"
                ) {
                    return;
                }

                reportMissingJSDoc(context, node.parent);
            },
        };
    },
    defaultOptions: [{ kinds: defaultKinds }],
    meta: {
        defaultOptions: [{ kinds: defaultKinds }],
        docs: {
            description:
                "require JSDoc comments for configured declaration kinds.",
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
