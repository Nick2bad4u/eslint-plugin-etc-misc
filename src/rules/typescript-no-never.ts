import {
    getConstrainedTypeAtLocation,
    isTypeNeverType,
} from "@typescript-eslint/type-utils";
import { type TSESTree as es, ESLintUtils } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";

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

        return {
            Identifier: (node: Readonly<es.Identifier>): void => {
                if (isTypeAliasNeverIdentifier(node)) {
                    return;
                }

                const type = getConstrainedTypeAtLocation(parserServices, node);

                if (!isTypeNeverType(type)) {
                    return;
                }

                context.report({
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
            description: "disallow inferred identifiers with `never` type.",
            frozen: false,
            recommended: false,
            requiresTypeChecking: true,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-no-never",
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
