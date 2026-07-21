import type { TSESTree as es } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden";

type Options = readonly [];

const selector =
    "VariableDeclarator:not([id.typeAnnotation], [init.expression.properties.length=0]) > Identifier.id";

/**
 * Disallow complex inferred declarator types without annotation.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => ({
        [selector]: (node: Readonly<es.Node>): void => {
            context.report({
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
                "disallow complex inferred declarator types without explicit annotation.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-no-complex-declarator-type",
        },
        hasSuggestions: false,
        languages: ["js/js"],
        messages: {
            forbidden:
                "Add a type annotation (or `as const`) for this complex declarator.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "typescript/no-complex-declarator-type",
});

export default rule;
