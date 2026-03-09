import { getConstrainedTypeAtLocation } from "@typescript-eslint/type-utils";
import { type TSESTree as es, ESLintUtils } from "@typescript-eslint/utils";
import * as tsutils from "tsutils";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden";

type Options = readonly [];

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
            "CallExpression[callee.type='MemberExpression'][callee.object.type='Identifier'][callee.object.name='Object'][callee.property.type='Identifier'][callee.property.name='assign']":
                (node: Readonly<es.CallExpression>): void => {
                    const [target] = node.arguments;
                    if (target === undefined) {
                        return;
                    }

                    const targetType = getConstrainedTypeAtLocation(
                        parserServices,
                        target
                    );
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
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-no-unsafe-object-assign",
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
