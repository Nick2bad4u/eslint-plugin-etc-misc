import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";
import type ts from "typescript";

import { ruleCreator } from "../_internal/rule-creator.js";
import { isArrayLikeType } from "../_internal/typescript-type-utils.js";

type MessageIds = "forbidden";

const mutatingMethodNames = new Set([
    "fill",
    "reverse",
    "sort",
]);

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

const isTypedParserServices = (
    parserServices: Readonly<TSESLint.SourceCode["parserServices"]> | undefined
): parserServices is TSESLint.SourceCode["parserServices"] & {
    readonly getTypeAtLocation: (node: Readonly<es.Node>) => ts.Type;
    readonly program: ts.Program;
} =>
    parserServices !== undefined &&
    "getTypeAtLocation" in parserServices &&
    typeof parserServices.getTypeAtLocation === "function";

const isArrayFactoryCallee = (callee: Readonly<es.Expression>): boolean => {
    if (callee.type === "Identifier") {
        return callee.name === "Array";
    }

    if (
        callee.type === "MemberExpression" &&
        callee.object.type === "Identifier" &&
        callee.object.name === "Array" &&
        callee.property.type === "Identifier"
    ) {
        return callee.property.name === "from" || callee.property.name === "of";
    }

    return false;
};

const isNewArray = (node: Readonly<es.Expression>): boolean => {
    if (node.type === "ArrayExpression") {
        return true;
    }

    if (node.type === "CallExpression") {
        return isArrayFactoryCallee(node.callee);
    }

    return false;
};

const mutatesReferencedArray = (
    callExpression: Readonly<es.CallExpression>
): boolean => {
    if (callExpression.callee.type !== "MemberExpression") {
        return true;
    }

    const { object, property } = callExpression.callee;

    if (
        property.type === "Identifier" &&
        creatorMethodNames.has(property.name)
    ) {
        return false;
    }

    if (isNewArray(object)) {
        return false;
    }

    if (object.type === "CallExpression") {
        return mutatesReferencedArray(object);
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
            const parserServices = context.sourceCode.parserServices;
            const typeChecker = isTypedParserServices(parserServices)
                ? parserServices.program.getTypeChecker()
                : undefined;

            return {
                "CallExpression[callee.type='MemberExpression'][callee.property.type='Identifier']":
                    (callExpression: Readonly<es.CallExpression>) => {
                        const { callee } = callExpression;
                        if (callee.type !== "MemberExpression") {
                            return;
                        }

                        const { property } = callee;
                        if (
                            property.type !== "Identifier" ||
                            !mutatingMethodNames.has(property.name)
                        ) {
                            return;
                        }

                        if (
                            callExpression.parent?.type ===
                            "ExpressionStatement"
                        ) {
                            return;
                        }

                        if (
                            typeChecker !== undefined &&
                            isTypedParserServices(parserServices)
                        ) {
                            const objectType = parserServices.getTypeAtLocation(
                                callee.object
                            );
                            if (!isArrayLikeType(typeChecker, objectType)) {
                                return;
                            }
                        }

                        if (!mutatesReferencedArray(callExpression)) {
                            return;
                        }

                        context.report({
                            messageId: "forbidden",
                            node: property,
                        });
                    },
            };
        },
        defaultOptions: [],
        meta: {
            docs: {
                description:
                    "disallow assigning values returned from mutating array methods.",
                recommended: false,
                url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-assign-mutated-array",
            },
            hasSuggestions: false,
            messages: {
                forbidden: "Assignment of mutated arrays is forbidden.",
            },
            schema: [],
            type: "problem",
        },
        name: "no-assign-mutated-array",
    });

export default rule;
