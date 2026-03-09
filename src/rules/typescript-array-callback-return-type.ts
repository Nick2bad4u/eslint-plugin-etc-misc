import type ts from "typescript";

import {
    containsAllTypesByName,
    getConstrainedTypeAtLocation,
    isTypeArrayTypeOrUnionOfArrayTypes,
} from "@typescript-eslint/type-utils";
import { type TSESTree as es, ESLintUtils } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden";

type Options = readonly [];

const arrayCallbackMethodNames = new Set<string>([
    "every",
    "find",
    "findIndex",
    "findLast",
    "findLastIndex",
    "flatMap",
    "forEach",
    "map",
    "some",
]);

const readonlyArrayTypeNames = new Set(["ReadonlyArray"]);

const callbackSelector =
    "CallExpression[callee.type='MemberExpression'][callee.property.type='Identifier'] > :matches(FunctionExpression, ArrowFunctionExpression):not([returnType])";

const isArrayLikeType = (
    typeChecker: Readonly<ts.TypeChecker>,
    type: Readonly<ts.Type>
): boolean => {
    const apparentType = typeChecker.getApparentType(type);

    return (
        typeChecker.isArrayType(apparentType) ||
        typeChecker.isTupleType(apparentType) ||
        isTypeArrayTypeOrUnionOfArrayTypes(type, typeChecker) ||
        containsAllTypesByName(type, false, readonlyArrayTypeNames, true)
    );
};

const isFirstCallbackArgument = (
    callExpression: Readonly<es.CallExpression>,
    callback:
        | Readonly<es.ArrowFunctionExpression>
        | Readonly<es.FunctionExpression>
): boolean => callExpression.arguments[0] === callback;

/**
 * Require explicit return types for array callback functions.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => {
        const parserServices = ESLintUtils.getParserServices(context);
        const typeChecker = parserServices.program.getTypeChecker();

        return {
            [callbackSelector]: (
                callback:
                    | Readonly<es.ArrowFunctionExpression>
                    | Readonly<es.FunctionExpression>
            ) => {
                const parentNode = callback.parent;
                if (parentNode?.type !== "CallExpression") {
                    return;
                }

                if (!isFirstCallbackArgument(parentNode, callback)) {
                    return;
                }

                const { callee } = parentNode;
                if (
                    callee.type !== "MemberExpression" ||
                    callee.object.type === "Super" ||
                    callee.property.type !== "Identifier" ||
                    !arrayCallbackMethodNames.has(callee.property.name)
                ) {
                    return;
                }

                const objectType = getConstrainedTypeAtLocation(
                    parserServices,
                    callee.object
                );
                if (!isArrayLikeType(typeChecker, objectType)) {
                    return;
                }

                context.report({
                    messageId: "forbidden",
                    node: callback,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require explicit return types for array callback functions.",
            recommended: false,
            requiresTypeChecking: true,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-array-callback-return-type",
        },
        hasSuggestions: false,
        messages: {
            forbidden: "Specify the callback return type explicitly.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "typescript/array-callback-return-type",
});

export default rule;
