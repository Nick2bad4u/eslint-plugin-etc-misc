import type ts from "typescript";

import {
    containsAllTypesByName,
    getConstrainedTypeAtLocation,
    isTypeArrayTypeOrUnionOfArrayTypes,
} from "@typescript-eslint/type-utils";
import {
    AST_NODE_TYPES,
    type TSESTree as es,
    ESLintUtils,
} from "@typescript-eslint/utils";
import { setHas } from "ts-extras";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden";

const readonlyArrayTypeNames = new Set(["ReadonlyArray"]);

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

const creatorMethodNames = new Set([
    "concat",
    "entries",
    "filter",
    "keys",
    "map",
    "slice",
    "splice",
    "values",
]);

const isArrayFactoryCallee = (callee: Readonly<es.Expression>): boolean => {
    if (callee.type === AST_NODE_TYPES.Identifier) {
        return callee.name === "Array";
    }

    if (
        callee.type === AST_NODE_TYPES.MemberExpression &&
        callee.object.type === AST_NODE_TYPES.Identifier &&
        callee.object.name === "Array" &&
        callee.property.type === AST_NODE_TYPES.Identifier
    ) {
        return callee.property.name === "from" || callee.property.name === "of";
    }

    return false;
};

const isNewArray = (node: Readonly<es.Expression>): boolean => {
    if (node.type === AST_NODE_TYPES.ArrayExpression) {
        return true;
    }

    if (node.type === AST_NODE_TYPES.CallExpression) {
        return isArrayFactoryCallee(node.callee);
    }

    return false;
};

const hasReferencedArrayMutation = (
    callExpression: Readonly<es.CallExpression>
): boolean => {
    if (callExpression.callee.type !== AST_NODE_TYPES.MemberExpression) {
        return true;
    }

    const { object, property } = callExpression.callee;

    if (
        property.type === AST_NODE_TYPES.Identifier &&
        setHas(creatorMethodNames, property.name)
    ) {
        return false;
    }

    if (isNewArray(object)) {
        return false;
    }

    if (object.type === AST_NODE_TYPES.CallExpression) {
        return hasReferencedArrayMutation(object);
    }

    return true;
};

/**
 * Disallow assigning arrays returned by mutating methods like `fill`,
 * `reverse`, and `sort`.
 */
const rule: ReturnType<typeof ruleCreator<readonly [], MessageIds>> =
    ruleCreator<readonly [], MessageIds>({
        create: (context) => {
            const parserServices = ESLintUtils.getParserServices(context);
            const typeChecker = parserServices.program.getTypeChecker();

            return {
                "CallExpression[callee.type='MemberExpression'][callee.property.type='Identifier'][callee.property.name=/^(?:fill|reverse|sort)$/]":
                    (callExpression: Readonly<es.CallExpression>) => {
                        const { callee } = callExpression;
                        if (callee.type !== AST_NODE_TYPES.MemberExpression) {
                            return;
                        }

                        const { property } = callee;
                        if (property.type !== AST_NODE_TYPES.Identifier) {
                            return;
                        }

                        if (
                            callExpression.parent.type ===
                            AST_NODE_TYPES.ExpressionStatement
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

                        if (!hasReferencedArrayMutation(callExpression)) {
                            return;
                        }

                        context.report({
                            messageId: "forbidden",
                            node: property,
                        });
                    },
            };
        },
        meta: {
            deprecated: false,
            docs: {
                deprecated: false,
                description:
                    "disallow assigning values returned from mutating array methods.",
                frozen: false,
                recommended: true,
                requiresTypeChecking: true,
                url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-assign-mutated-array",
            },
            hasSuggestions: false,
            languages: ["js/js"],
            messages: {
                forbidden: "Assignment of mutated arrays is forbidden.",
            },
            schema: [],
            type: "problem",
        },
        name: "no-assign-mutated-array",
    });

export default rule;
