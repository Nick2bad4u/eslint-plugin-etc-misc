import type { TSESTree as es } from "@typescript-eslint/utils";

import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import { arrayJoin } from "ts-extras";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden";

type Options = readonly [];

const selector = arrayJoin(
    [
        "TSPropertySignature[optional=true] > TSTypeAnnotation > TSLiteralType > Literal[value=true]",
        "TSPropertySignature[optional=true] > TSTypeAnnotation > TSLiteralType > Literal[value=false]",
    ],
    ", "
);

/**
 * Disallow optional boolean literal property types.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => ({
        [selector]: (node: Readonly<es.Node>): void => {
            if (node.type !== AST_NODE_TYPES.Literal) {
                return;
            }

            context.report({
                fix: (fixer) => fixer.replaceText(node, "boolean"),
                messageId: "forbidden",
                node,
            });
        },
    }),
    meta: {
        deprecated: false,
        docs: {
            deprecated: false,
            description:
                "disallow optional boolean literal types in property signatures.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-no-boolean-literal-type",
        },
        fixable: "code",
        hasSuggestions: false,
        languages: ["js/js"],
        messages: {
            forbidden: 'Use "boolean" type instead.',
        },
        schema: [],
        type: "suggestion",
    },
    name: "typescript/no-boolean-literal-type",
});

export default rule;
