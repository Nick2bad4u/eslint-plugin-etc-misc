import { type TSESTree as es, ESLintUtils } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator";

type MessageIds = "forbidden";

type Options = readonly [];

const isTypeAliasNeverIdentifier = (node: Readonly<es.Identifier>): boolean =>
    node.parent.type === "TSTypeAliasDeclaration" &&
    node.parent.id === node &&
    node.parent.typeAnnotation.type === "TSNeverKeyword";

/**
 * Disallow inferred `never` types on identifiers.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => {
        const parserServices = ESLintUtils.getParserServices(context);
        const checker = parserServices.program.getTypeChecker();

        return {
            Identifier: (node: Readonly<es.Identifier>): void => {
                if (isTypeAliasNeverIdentifier(node)) {
                    return;
                }

                const tsNode = parserServices.esTreeNodeToTSNodeMap.get(node);
                const type = checker.getTypeAtLocation(tsNode);

                if (checker.typeToString(type) !== "never") {
                    return;
                }

                context.report({
                    messageId: "forbidden",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description: "disallow inferred identifiers with `never` type.",
            recommended: false,
            requiresTypeChecking: true,
            url: "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/typescript-no-never.md",
        },
        hasSuggestions: false,
        messages: {
            forbidden: "Unexpected `never` type on this identifier.",
        },
        schema: [],
        type: "problem",
    },
    name: "typescript/no-never",
});

export default rule;
