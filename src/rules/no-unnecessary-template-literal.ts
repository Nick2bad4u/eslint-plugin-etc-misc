import type { TSESTree as es } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden";

type Options = readonly [];

const selector = "TemplateLiteral[expressions.length=0] > TemplateElement";

const toSafeStringLiteralText = (
    templateLiteral: Readonly<es.TemplateLiteral>
): string =>
    JSON.stringify(
        templateLiteral.quasis[0]?.value.cooked ??
            templateLiteral.quasis[0]?.value.raw ??
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
                node.type === "TemplateElement" &&
                node.parent?.type === "TemplateLiteral"
                    ? node.parent
                    : undefined;

            if (templateLiteral === undefined) {
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
    defaultOptions: [],
    meta: {
        deprecated: false,
        docs: {
            deprecated: false,
            description:
                "disallow template literals that have no interpolated expressions.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-unnecessary-template-literal",
        },
        fixable: "code",
        hasSuggestions: false,
        messages: {
            forbidden:
                "Use a string literal instead of an expression-free template literal.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "no-unnecessary-template-literal",
});

export default rule;
