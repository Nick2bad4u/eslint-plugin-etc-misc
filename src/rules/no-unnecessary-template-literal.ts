import type { TSESTree as es } from "@typescript-eslint/utils";

import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import { arrayFirst } from "ts-extras";

import { ruleCreator } from "../_internal/rule-creator.js";
import {
    createReplacementRuleInfo,
    withDeprecatedRuleLifecycle,
} from "../_internal/rule-deprecation.js";

type MessageIds = "forbidden";

type Options = readonly [];

const selector = "TemplateLiteral[expressions.length=0] > TemplateElement";

const isStringLiteralStatement = (
    statement: Readonly<es.ProgramStatement>
): boolean =>
    statement.type === AST_NODE_TYPES.ExpressionStatement &&
    statement.expression.type === AST_NODE_TYPES.Literal &&
    typeof statement.expression.value === "string";

const isFunctionBody = (block: Readonly<es.BlockStatement>): boolean =>
    (block.parent.type === AST_NODE_TYPES.ArrowFunctionExpression ||
        block.parent.type === AST_NODE_TYPES.FunctionDeclaration ||
        block.parent.type === AST_NODE_TYPES.FunctionExpression) &&
    block.parent.body === block;

const wouldCreateDirective = (
    templateLiteral: Readonly<es.TemplateLiteral>
): boolean => {
    const statement = templateLiteral.parent;

    if (statement.type !== AST_NODE_TYPES.ExpressionStatement) {
        return false;
    }

    const container = statement.parent;
    let statements: readonly es.ProgramStatement[] | undefined;

    if (
        container.type === AST_NODE_TYPES.Program ||
        (container.type === AST_NODE_TYPES.BlockStatement &&
            isFunctionBody(container))
    ) {
        statements = container.body;
    }

    if (statements === undefined) {
        return false;
    }

    for (const currentStatement of statements) {
        if (currentStatement === statement) {
            return true;
        }

        if (!isStringLiteralStatement(currentStatement)) {
            return false;
        }
    }

    return false;
};

const toSafeStringLiteralText = (
    templateLiteral: Readonly<es.TemplateLiteral>
): string =>
    JSON.stringify(
        arrayFirst(templateLiteral.quasis)?.value.cooked ??
            arrayFirst(templateLiteral.quasis)?.value.raw ??
            ""
    );

/**
 * Disallow template literals with no expressions.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => ({
        [selector]: (node: Readonly<es.Node>): void => {
            const templateLiteral =
                node.type === AST_NODE_TYPES.TemplateElement &&
                node.parent.type === AST_NODE_TYPES.TemplateLiteral
                    ? node.parent
                    : undefined;

            if (templateLiteral === undefined) {
                return;
            }

            if (
                templateLiteral.parent.type ===
                AST_NODE_TYPES.TaggedTemplateExpression
            ) {
                return;
            }

            if (wouldCreateDirective(templateLiteral)) {
                context.report({
                    messageId: "forbidden",
                    node,
                });
                return;
            }

            context.report({
                fix: (fixer) =>
                    fixer.replaceText(
                        templateLiteral,
                        toSafeStringLiteralText(templateLiteral)
                    ),
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
                "disallow template literals that have no interpolated expressions.",
            frozen: true,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-unnecessary-template-literal",
        },
        fixable: "code",
        hasSuggestions: false,
        languages: ["js/js"],
        messages: {
            forbidden:
                "Use a string literal instead of an expression-free template literal.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "no-unnecessary-template-literal",
});

/**
 * Wrapper rule with explicit lifecycle metadata and replacement mapping.
 */
const deprecatedRule: typeof rule = withDeprecatedRuleLifecycle(rule, {
    deprecatedSince: "3.0.0",
    message: "Deprecated in favor of unicorn/no-useless-template-literals.",
    replacedBy: [
        createReplacementRuleInfo({
            plugin: {
                name: "unicorn",
                url: "https://github.com/sindresorhus/eslint-plugin-unicorn",
            },
            rule: {
                name: "no-useless-template-literals",
                url: "https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-useless-template-literals.md",
            },
        }),
    ],
    ruleId: "no-unnecessary-template-literal",
});

export default deprecatedRule;
