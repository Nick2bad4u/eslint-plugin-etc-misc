import type ts from "typescript";

import {
    getConstrainedTypeAtLocation,
    isBuiltinSymbolLike,
    isErrorLike,
    isTypeAnyType,
    isTypeUnknownType,
} from "@typescript-eslint/type-utils";
import {
    type TSESTree as es,
    ESLintUtils,
    type TSESLint,
} from "@typescript-eslint/utils";
import * as tsutils from "tsutils";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden" | "suggestWrapInError";

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

const createWrapLiteralInErrorSuggestionFix = (
    sourceCode: Readonly<TSESLint.SourceCode>,
    node: Readonly<es.Node>
): TSESLint.ReportFixFunction | undefined => {
    if (node.type !== "Literal") {
        return undefined;
    }

    return (fixer) =>
        fixer.replaceText(node, `new Error(${sourceCode.getText(node)})`);
};

/**
 * Disallow throwing or rejecting values that are not Error-like.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => {
        const parserServices = ESLintUtils.getParserServices(context);
        const sourceCode = context.sourceCode;
        const { program } = parserServices;

        const reportIfNonErrorLike = (
            node: Readonly<es.Node>,
            usage: "Rejecting with" | "Throwing"
        ): void => {
            const type = getConstrainedTypeAtLocation(parserServices, node);

            if (couldBeAllowedThrowableType(type, program)) {
                return;
            }

            const suggestionFix = createWrapLiteralInErrorSuggestionFix(
                sourceCode,
                node
            );

            context.report({
                data: { usage },
                messageId: "forbidden",
                node,
                ...(suggestionFix === undefined
                    ? {}
                    : {
                          suggest: [
                              {
                                  fix: suggestionFix,
                                  messageId: "suggestWrapInError",
                              },
                          ],
                      }),
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
        hasSuggestions: true,
        messages: {
            forbidden: "{{usage}} non-`Error` values is forbidden.",
            suggestWrapInError:
                "Wrap this value in an Error constructor before throwing or rejecting.",
        },
        schema: [],
        type: "problem",
    },
    name: "throw-error",
});

export default rule;
