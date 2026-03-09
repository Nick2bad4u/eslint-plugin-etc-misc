import { type TSESTree as es, ESLintUtils } from "@typescript-eslint/utils";
import * as tsutils from "tsutils";

import { ruleCreator } from "../_internal/rule-creator";

type MessageIds = "forbidden";

type Options = readonly [];

const isObjectAssignCall = (node: Readonly<es.CallExpression>): boolean =>
    node.callee.type === "MemberExpression" &&
    node.callee.object.type === "Identifier" &&
    node.callee.object.name === "Object" &&
    node.callee.property.type === "Identifier" &&
    node.callee.property.name === "assign";

/**
 * Disallow Object.assign into targets with readonly properties.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => {
        const parserServices = ESLintUtils.getParserServices(context);
        const checker = parserServices.program.getTypeChecker();

        const hasReadonlyProperty = (
            type: ReturnType<typeof checker.getTypeAtLocation>
        ): boolean =>
            type
                .getProperties()
                .some((property) =>
                    tsutils.isPropertyReadonlyInType(
                        type,
                        property.getEscapedName(),
                        checker
                    )
                );

        return {
            CallExpression: (node: Readonly<es.CallExpression>): void => {
                if (!isObjectAssignCall(node)) {
                    return;
                }

                const [target] = node.arguments;
                if (target === undefined) {
                    return;
                }

                const tsTarget =
                    parserServices.esTreeNodeToTSNodeMap.get(target);
                const targetType = checker.getTypeAtLocation(tsTarget);
                if (!hasReadonlyProperty(targetType)) {
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
            description:
                "disallow Object.assign calls that mutate readonly-typed targets.",
            recommended: false,
            requiresTypeChecking: true,
            url: "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/typescript-no-unsafe-object-assign.md",
        },
        hasSuggestions: false,
        messages: {
            forbidden:
                "Do not use Object.assign on targets with readonly properties.",
        },
        schema: [],
        type: "problem",
    },
    name: "typescript/no-unsafe-object-assign",
});

export default rule;
