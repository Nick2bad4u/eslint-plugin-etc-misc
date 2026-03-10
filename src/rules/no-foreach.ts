import type ts from "typescript";

import {
    containsAllTypesByName,
    getConstrainedTypeAtLocation,
    isTypeArrayTypeOrUnionOfArrayTypes,
} from "@typescript-eslint/type-utils";
import { type TSESTree as es, ESLintUtils } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden";

type Options = readonly [
    {
        readonly types?: readonly string[];
    }?,
];

const defaultOptions: Options = [{}];

const defaultTypes: readonly string[] = [
    "Array",
    "Map",
    "NodeList",
    "Set",
];

const getConfiguredTypeNames = (
    configuredTypes: readonly string[]
): Set<string> => {
    const typeNames = new Set<string>();

    for (const configuredType of configuredTypes) {
        typeNames.add(configuredType);
        if (configuredType === "Array") {
            typeNames.add("ReadonlyArray");
        }
    }

    return typeNames;
};

const matchesConfiguredCollectionType = (
    typeChecker: Readonly<ts.TypeChecker>,
    type: Readonly<ts.Type>,
    configuredTypeNames: Set<string>
): boolean => {
    if (configuredTypeNames.has("Array")) {
        const apparentType = typeChecker.getApparentType(type);

        if (
            typeChecker.isArrayType(apparentType) ||
            typeChecker.isTupleType(apparentType) ||
            isTypeArrayTypeOrUnionOfArrayTypes(type, typeChecker)
        ) {
            return true;
        }
    }

    return containsAllTypesByName(type, false, configuredTypeNames, true);
};

/**
 * Disallow calling `forEach` on configured collection types.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => {
        const parserServices = ESLintUtils.getParserServices(context);
        const typeChecker = parserServices.program.getTypeChecker();

        const [{ types = defaultTypes } = {}] = context.options;
        const configuredTypeNames = getConfiguredTypeNames(types);

        return {
            "CallExpression[callee.type='MemberExpression'][callee.property.type='Identifier'][callee.property.name='forEach']":
                (callExpression: Readonly<es.CallExpression>) => {
                    const { callee } = callExpression;
                    if (callee.type !== "MemberExpression") {
                        return;
                    }

                    const objectType = getConstrainedTypeAtLocation(
                        parserServices,
                        callee.object
                    );
                    if (
                        !matchesConfiguredCollectionType(
                            typeChecker,
                            objectType,
                            configuredTypeNames
                        )
                    ) {
                        return;
                    }

                    context.report({
                        messageId: "forbidden",
                        node: callee.property,
                    });
                },
        };
    },
    defaultOptions,
    meta: {
        defaultOptions: [{}],
        deprecated: false,
        docs: {
            deprecated: false,
            description:
                "disallow calling forEach on configured collection types.",
            frozen: false,
            recommended: false,
            requiresTypeChecking: true,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-foreach",
        },
        hasSuggestions: false,
        messages: {
            forbidden: "Calling `forEach` is forbidden for this type.",
        },
        schema: [
            {
                additionalProperties: false,
                description:
                    "Configuration for collection type names that are not allowed to use forEach.",
                properties: {
                    types: {
                        description:
                            "Type names to disallow forEach on (for example Array, Map, NodeList, Set).",
                        items: {
                            type: "string",
                        },
                        type: "array",
                    },
                },
                type: "object",
            },
        ],
        type: "problem",
    },
    name: "no-foreach",
});

export default rule;
