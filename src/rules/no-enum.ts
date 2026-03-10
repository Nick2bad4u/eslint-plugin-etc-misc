import type { TSESTree as es } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden";

/**
 * Disallow TypeScript enum declarations.
 */
const rule: ReturnType<typeof ruleCreator<readonly [], MessageIds>> =
    ruleCreator<readonly [], MessageIds>({
        create: (context) => ({
            TSEnumDeclaration: (node: Readonly<es.TSEnumDeclaration>) => {
                context.report({
                    messageId: "forbidden",
                    node: node.id,
                });
            },
        }),
        defaultOptions: [],
        meta: {
        deprecated: false,
            docs: {
                deprecated: false,
                description: "disallow TypeScript enum declarations.",
                frozen: false,
                recommended: false,
                url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-enum",
            },
            hasSuggestions: false,
            messages: {
                forbidden: "`enum` declarations are forbidden.",
            },
            schema: [],
            type: "problem",
        },
        name: "no-enum",
    });

export default rule;
