import type { TSESTree as es } from "@typescript-eslint/utils";
import type { Parameters as RecheckParameters } from "recheck";

import { checkSync } from "recheck";
import { arrayFirst, isDefined, keyIn, setHas } from "ts-extras";

import { ruleCreator } from "../_internal/rule-creator.js";

type ComplexityType = "exponential" | "polynomial";

type MessageIds = "checkerError" | "vulnerable";

type Options = readonly [RuleOption?];

type RuleOption = Readonly<
    RecheckParameters & {
        readonly ignoreErrors?: boolean;
        readonly permittableComplexities?: readonly ComplexityType[];
    }
>;

const getStaticStringValue = (node: Readonly<es.Expression>): null | string => {
    if (node.type === "Literal" && typeof node.value === "string") {
        return node.value;
    }

    if (
        node.type === "TemplateLiteral" &&
        node.expressions.length === 0 &&
        node.quasis.length === 1
    ) {
        return arrayFirst(node.quasis)?.value.cooked ?? null;
    }

    return null;
};

const isNonSpreadArgument = (
    argument: Readonly<es.CallExpressionArgument>
): argument is Readonly<es.Expression> => argument.type !== "SpreadElement";

const isRegExpConstructorCall = (
    node: Readonly<es.CallExpression | es.NewExpression>
): boolean => {
    if (node.callee.type !== "Identifier" || node.callee.name !== "RegExp") {
        return false;
    }

    if (node.arguments.length === 0 || node.arguments.length > 2) {
        return false;
    }

    const sourceArgument = arrayFirst(node.arguments);

    if (!isDefined(sourceArgument) || !isNonSpreadArgument(sourceArgument)) {
        return false;
    }

    const sourceValue = getStaticStringValue(sourceArgument);

    if (sourceValue === null) {
        return false;
    }

    const flagsArgument = node.arguments[1];

    if (flagsArgument === undefined) {
        return true;
    }

    if (flagsArgument.type === "SpreadElement") {
        return false;
    }

    return isDefined(getStaticStringValue(flagsArgument));
};

const getStaticFlagsValue = (
    argument: Readonly<es.CallExpressionArgument> | undefined
): null | string => {
    if (!isDefined(argument)) {
        return "";
    }

    if (!isNonSpreadArgument(argument)) {
        return null;
    }

    return getStaticStringValue(argument);
};

const getDiagnosticsErrorMessage = (
    error: Readonly<{
        readonly kind: string;
        readonly message?: string;
    }>
): string => {
    if (keyIn(error, "message") && typeof error.message === "string") {
        return error.message;
    }

    return "No additional details provided.";
};

/**
 * Detect ReDoS-vulnerable regular expressions using `recheck`.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context, [rawOptions]) => {
        const options = rawOptions ?? {};
        const {
            ignoreErrors = true,
            permittableComplexities = [],
            ...recheckParameters
        } = options;
        const allowedComplexities = new Set(permittableComplexities);

        const reportDiagnostics = (
            node: Readonly<es.Node>,
            source: string,
            flags: string
        ): void => {
            const diagnostics = checkSync(source, flags, recheckParameters);

            if (diagnostics.status === "safe") {
                return;
            }

            if (diagnostics.status === "vulnerable") {
                if (setHas(allowedComplexities, diagnostics.complexity.type)) {
                    return;
                }

                context.report({
                    data: {
                        summary: diagnostics.complexity.summary,
                    },
                    messageId: "vulnerable",
                    node,
                });

                return;
            }

            if (ignoreErrors) {
                return;
            }

            context.report({
                data: {
                    kind: diagnostics.error.kind,
                    message: getDiagnosticsErrorMessage(diagnostics.error),
                },
                messageId: "checkerError",
                node,
            });
        };

        return {
            CallExpression: (node: Readonly<es.CallExpression>): void => {
                if (!isRegExpConstructorCall(node)) {
                    return;
                }

                const sourceArgument = arrayFirst(node.arguments);

                if (
                    !isDefined(sourceArgument) ||
                    !isNonSpreadArgument(sourceArgument)
                ) {
                    return;
                }

                const source = getStaticStringValue(sourceArgument);
                const secondArgument = node.arguments[1];
                const flags = getStaticFlagsValue(secondArgument);

                if (source === null || flags === null) {
                    return;
                }

                reportDiagnostics(node, source, flags);
            },
            Literal: (node: Readonly<es.Literal>): void => {
                if (!(node.value instanceof RegExp)) {
                    return;
                }

                reportDiagnostics(node, node.value.source, node.value.flags);
            },
            NewExpression: (node: Readonly<es.NewExpression>): void => {
                if (!isRegExpConstructorCall(node)) {
                    return;
                }

                const sourceArgument = arrayFirst(node.arguments);

                if (
                    !isDefined(sourceArgument) ||
                    !isNonSpreadArgument(sourceArgument)
                ) {
                    return;
                }

                const source = getStaticStringValue(sourceArgument);
                const secondArgument = node.arguments[1];
                const flags = getStaticFlagsValue(secondArgument);

                if (source === null || flags === null) {
                    return;
                }

                reportDiagnostics(node, source, flags);
            },
        };
    },
    meta: {
        defaultOptions: [{}],
        deprecated: false,
        docs: {
            deprecated: false,
            description: "disallow ReDoS-vulnerable regular expressions.",
            frozen: false,
            recommended: true,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-vulnerable",
        },
        hasSuggestions: false,
        messages: {
            checkerError:
                "ReDoS analysis failed ({{kind}}): {{message}}. Consider setting ignoreErrors to true for this pattern.",
            vulnerable:
                "Potential ReDoS-vulnerable regular expression detected ({{summary}}).",
        },
        schema: [
            {
                additionalProperties: false,
                description:
                    "Configuration for ReDoS analysis, including recheck parameters and local rule behavior flags.",
                properties: {
                    ignoreErrors: {
                        description:
                            "Whether to suppress errors returned by the ReDoS analyzer.",
                        type: "boolean",
                    },
                    permittableComplexities: {
                        description:
                            "List of vulnerable complexity categories to permit without reporting.",
                        items: {
                            enum: ["polynomial", "exponential"],
                            type: "string",
                        },
                        type: "array",
                        uniqueItems: true,
                    },
                    timeout: {
                        description:
                            "Maximum analysis time budget in milliseconds passed through to recheck.",
                        type: ["number", "null"],
                    },
                },
                type: "object",
            },
        ],
        type: "problem",
    },
    name: "no-vulnerable",
});

export default rule;
