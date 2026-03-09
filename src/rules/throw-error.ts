import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";
import type * as ts from "typescript";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden";

type Options = readonly [];

type TypedParserServices = TSESLint.SourceCode["parserServices"] & {
    readonly esTreeNodeToTSNodeMap: Readonly<
        WeakMap<Readonly<es.Node>, ts.Node>
    >;
    readonly program: ts.Program;
};

const hasTypedParserServices = (
    parserServices: Readonly<TSESLint.SourceCode["parserServices"]> | undefined
): parserServices is TypedParserServices =>
    parserServices !== undefined &&
    "esTreeNodeToTSNodeMap" in parserServices &&
    "program" in parserServices;

const getTypeVariants = (
    typeChecker: Readonly<ts.TypeChecker>,
    type: Readonly<ts.Type>
): readonly string[] =>
    typeChecker
        .typeToString(type)
        .split("|")
        .map((variant) => variant.trim());

const isAnyOrUnknownVariant = (typeVariant: string): boolean =>
    typeVariant === "any" || typeVariant === "unknown";

const isErrorLikeVariant = (typeVariant: string): boolean =>
    typeVariant === "Error" ||
    typeVariant === "DOMException" ||
    typeVariant.endsWith("Error") ||
    typeVariant.includes("Error<");

const couldBeAllowedThrowableType = (
    type: Readonly<ts.Type>,
    typeChecker: Readonly<ts.TypeChecker>
): boolean =>
    getTypeVariants(typeChecker, type).some(
        (typeVariant) =>
            isAnyOrUnknownVariant(typeVariant) ||
            isErrorLikeVariant(typeVariant)
    );

const isPromiseConstructorVariant = (typeVariant: string): boolean =>
    typeVariant === "PromiseConstructor" ||
    typeVariant === "typeof Promise" ||
    typeVariant.startsWith("PromiseConstructor") ||
    typeVariant.includes("PromiseConstructor ");

const couldBePromiseConstructorType = (
    type: Readonly<ts.Type>,
    typeChecker: Readonly<ts.TypeChecker>
): boolean =>
    getTypeVariants(typeChecker, type).some((typeVariant) => {
        if (isAnyOrUnknownVariant(typeVariant)) {
            return false;
        }

        return isPromiseConstructorVariant(typeVariant);
    });

const isPromiseIdentifier = (node: Readonly<es.Expression>): boolean =>
    node.type === "Identifier" && node.name === "Promise";

const getNodeType = (
    parserServices: Readonly<TypedParserServices>,
    typeChecker: Readonly<ts.TypeChecker>,
    node: Readonly<es.Node>
): ts.Type | undefined => {
    const tsNode = parserServices.esTreeNodeToTSNodeMap.get(node);
    if (tsNode === undefined) {
        return undefined;
    }

    return typeChecker.getTypeAtLocation(tsNode);
};

/**
 * Disallow throwing or rejecting values that are not Error-like.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => {
        const parserServices = context.sourceCode.parserServices;
        if (!hasTypedParserServices(parserServices)) {
            return {};
        }

        const typeChecker = parserServices.program.getTypeChecker();

        const reportIfNonErrorLike = (
            node: Readonly<es.Node>,
            usage: "Rejecting with" | "Throwing"
        ): void => {
            const type = getNodeType(parserServices, typeChecker, node);
            if (type === undefined) {
                return;
            }

            if (couldBeAllowedThrowableType(type, typeChecker)) {
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

                    const objectType = getNodeType(
                        parserServices,
                        typeChecker,
                        callee.object
                    );

                    if (objectType !== undefined) {
                        if (
                            !couldBePromiseConstructorType(
                                objectType,
                                typeChecker
                            ) &&
                            !isPromiseIdentifier(callee.object)
                        ) {
                            return;
                        }
                    } else if (!isPromiseIdentifier(callee.object)) {
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
        docs: {
            description:
                "disallow throwing or rejecting values that are not Error-like.",
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
