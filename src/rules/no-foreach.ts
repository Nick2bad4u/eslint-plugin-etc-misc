import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator";

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

const isTypedParserServices = (
    parserServices: Readonly<TSESLint.SourceCode["parserServices"]> | undefined
): parserServices is TSESLint.SourceCode["parserServices"] & {
    readonly getTypeAtLocation: (node: Readonly<es.Node>) => unknown;
    readonly program: {
        readonly getTypeChecker: () => {
            readonly typeToString: (type: unknown) => string;
        };
    };
} =>
    parserServices !== undefined &&
    "getTypeAtLocation" in parserServices &&
    typeof parserServices.getTypeAtLocation === "function";

const doesTypeTextMatch = (
    typeText: string,
    configuredType: string
): boolean => {
    if (configuredType === "Array") {
        return (
            typeText.endsWith("[]") ||
            typeText.startsWith("Array<") ||
            typeText.startsWith("ReadonlyArray<")
        );
    }

    return (
        typeText === configuredType || typeText.startsWith(`${configuredType}<`)
    );
};

const includesConfiguredType = (
    rawTypeText: string,
    configuredTypes: readonly string[]
): boolean => {
    const typeVariants = rawTypeText
        .split("|")
        .map((typeText) => typeText.trim());

    return typeVariants.some((typeText) =>
        configuredTypes.some((configuredType) =>
            doesTypeTextMatch(typeText, configuredType)
        )
    );
};

/**
 * Disallow calling `forEach` on configured collection types.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => {
        const parserServices = context.sourceCode.parserServices;
        if (!isTypedParserServices(parserServices)) {
            return {};
        }

        const [{ types = defaultTypes } = {}] = context.options;
        const typeChecker = parserServices.program.getTypeChecker();

        return {
            "CallExpression[callee.type='MemberExpression'][callee.property.type='Identifier'][callee.property.name='forEach']":
                (callExpression: Readonly<es.CallExpression>) => {
                    const { callee } = callExpression;
                    if (callee.type !== "MemberExpression") {
                        return;
                    }

                    const objectType = parserServices.getTypeAtLocation(
                        callee.object
                    );
                    const typeText = typeChecker.typeToString(objectType);
                    if (!includesConfiguredType(typeText, types)) {
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
        docs: {
            description:
                "disallow calling forEach on configured collection types.",
            recommended: false,
            url: "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/no-foreach.md",
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
