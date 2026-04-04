import type { TSESTree as es } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden";

type Options = readonly [];

const disallowedSelector =
    "VariableDeclarator > TSAsExpression[expression.properties.length=0] > TSTypeReference > Identifier[name='const'], VariableDeclarator[id.typeAnnotation] > TSAsExpression > TSTypeReference > Identifier[name='const']";

const getAsConstExpression = (
    node: Readonly<es.Node>
): Readonly<es.TSAsExpression> | undefined => {
    if (
        node.type !== "Identifier" ||
        node.parent?.type !== "TSTypeReference" ||
        node.parent.parent?.type !== "TSAsExpression"
    ) {
        return undefined;
    }

    return node.parent.parent;
};

/**
 * Disallow unnecessary `as const` assertions.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => {
        const sourceCode = context.sourceCode;

        return {
            [disallowedSelector]: (node: Readonly<es.Node>): void => {
                const asConstExpression = getAsConstExpression(node);
                if (asConstExpression === undefined) {
                    return;
                }

                const replacementText = sourceCode.getText(
                    asConstExpression.expression
                );

                context.report({
                    fix: (fixer) =>
                        fixer.replaceText(asConstExpression, replacementText),
                    messageId: "forbidden",
                    node,
                });
            },
        };
    },
    meta: {
        deprecated: false,
        docs: {
            deprecated: false,
            description: "disallow unnecessary as const assertions.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-unnecessary-as-const",
        },
        fixable: "code",
        hasSuggestions: false,
        messages: {
            forbidden: "Unnecessary as const assertion.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "no-unnecessary-as-const",
});

export default rule;
