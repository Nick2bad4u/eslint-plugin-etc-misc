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
            docs: {
                description: "disallow TypeScript enum declarations.",
                recommended: false,
                url: "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/no-enum.md",
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
