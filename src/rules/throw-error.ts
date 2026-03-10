import type ts from "typescript";

import {
    getConstrainedTypeAtLocation,
    isBuiltinSymbolLike,
    isErrorLike,
    isTypeAnyType,
    isTypeUnknownType,
} from "@typescript-eslint/type-utils";
import { type TSESTree as es, ESLintUtils } from "@typescript-eslint/utils";
import * as tsutils from "tsutils";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden";

type Options = readonly [];

const isAllowedThrowableVariant = (
    type: Readonly<ts.Type>,
    program: Readonly<ts.Program>
): boolean =>
    isTypeAnyType(type) ||
    isTypeUnknownType(type) ||
    isErrorLike(program, type);

const couldBeAllowedThrowableType = (
    type: Readonly<ts.Type>,
    program: Readonly<ts.Program>
): boolean =>
    tsutils
        .unionTypeParts(type)
        .every((typeVariant) =>
            isAllowedThrowableVariant(typeVariant, program)
        );

const couldBePromiseConstructorType = (
    type: Readonly<ts.Type>,
    program: Readonly<ts.Program>
): boolean =>
    tsutils
        .unionTypeParts(type)
        .some((typeVariant) =>
            isBuiltinSymbolLike(program, typeVariant, "PromiseConstructor")
        );

const isPromiseIdentifier = (node: Readonly<es.Expression>): boolean =>
    node.type === "Identifier" && node.name === "Promise";

/**
 * Disallow throwing or rejecting values that are not Error-like.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => {
        const parserServices = ESLintUtils.getParserServices(context);
        const { program } = parserServices;

        const reportIfNonErrorLike = (
            node: Readonly<es.Node>,
            usage: "Rejecting with" | "Throwing"
        ): void => {
            const type = getConstrainedTypeAtLocation(parserServices, node);

            if (couldBeAllowedThrowableType(type, program)) {
                return;
            }

            context.report({
                data: { usage },
                messageId: "forbidden",
                node,
            });
        };

        const checkRejectionCall = (
            callExpression: Readonly<es.CallExpression>
        ): void => {
            const rejectionValue = callExpression.arguments[0];
            if (rejectionValue === undefined) {
                return;
            }

            reportIfNonErrorLike(rejectionValue, "Rejecting with");
        };

        return {
            "CallExpression[callee.type='MemberExpression'][callee.property.type='Identifier'][callee.property.name='reject']":
                (callExpression: Readonly<es.CallExpression>) => {
                    const { callee } = callExpression;
                    if (
                        callee.type !== "MemberExpression" ||
                        callee.object.type === "Super"
                    ) {
                        return;
                    }

                    const objectType = getConstrainedTypeAtLocation(
                        parserServices,
                        callee.object
                    );
                    if (
                        !couldBePromiseConstructorType(objectType, program) &&
                        !isPromiseIdentifier(callee.object)
                    ) {
                        return;
                    }

                    checkRejectionCall(callExpression);
                },
            "NewExpression[callee.type='Identifier'][callee.name='Promise'] > ArrowFunctionExpression, NewExpression[callee.type='Identifier'][callee.name='Promise'] > FunctionExpression":
                (
                    callback:
                        | Readonly<es.ArrowFunctionExpression>
                        | Readonly<es.FunctionExpression>
                ) => {
                    const rejectParameter = callback.params[1];
                    if (rejectParameter?.type !== "Identifier") {
                        return;
                    }

                    const rejectVariable = context.sourceCode
                        .getDeclaredVariables(callback)
                        .find(
                            (declaredVariable) =>
                                declaredVariable.name === rejectParameter.name
                        );
                    if (rejectVariable === undefined) {
                        return;
                    }

                    for (const reference of rejectVariable.references) {
                        const { identifier } = reference;
                        const parent = identifier.parent;
                        if (
                            parent?.type === "CallExpression" &&
                            parent.callee === identifier
                        ) {
                            checkRejectionCall(parent);
                        }
                    }
                },
            ThrowStatement: (throwStatement: Readonly<es.ThrowStatement>) => {
                const { argument } = throwStatement;
                if (argument === null) {
                    return;
                }

                reportIfNonErrorLike(argument, "Throwing");
            },
        };
    },
    defaultOptions: [],
    meta: {
        deprecated: false,
        docs: {
            deprecated: false,
            description:
                "disallow throwing or rejecting values that are not Error-like.",
            frozen: false,
            recommended: false,
            requiresTypeChecking: true,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/throw-error",
        },
        hasSuggestions: false,
        messages: {
            forbidden: "{{usage}} non-`Error` values is forbidden.",
        },
        schema: [],
        type: "problem",
    },
    name: "throw-error",
});

export default rule;
