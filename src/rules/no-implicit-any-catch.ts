import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

import { ESLintUtils } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds =
    | "explicitAny"
    | "implicitAny"
    | "narrowed"
    | "suggestExplicitUnknown";

type Options = readonly [RuleOptions?];

type PromiseTypeChecker = Readonly<{
    getPromisedTypeOfPromise: (type: unknown) => unknown;
}>;

type RuleOptions = Readonly<{
    allowExplicitAny?: boolean;
}>;

type TypeChecker = ReturnType<TypedProgram["getTypeChecker"]>;

type TypedProgram = NonNullable<
    ReturnType<typeof ESLintUtils.getParserServices>["program"]
>;

const hasPromiseTypeMethod = (
    typeChecker: unknown
): typeChecker is PromiseTypeChecker =>
    typeof typeChecker === "object" &&
    typeChecker !== null &&
    "getPromisedTypeOfPromise" in typeChecker &&
    typeof typeChecker.getPromisedTypeOfPromise === "function";

const defaultOptions: Options = [{}];

const isPromiseRejectionCall = (
    callExpression: Readonly<es.CallExpression>,
    parserServices: Readonly<ReturnType<typeof ESLintUtils.getParserServices>>,
    typeChecker: TypeChecker
): boolean => {
    const { callee } = callExpression;
    if (callee.type !== "MemberExpression" || callee.object.type === "Super") {
        return false;
    }

    const tsNode = parserServices.esTreeNodeToTSNodeMap.get(callee.object);
    const objectType = typeChecker.getTypeAtLocation(tsNode);
    if (!hasPromiseTypeMethod(typeChecker)) {
        return false;
    }

    return typeChecker.getPromisedTypeOfPromise(objectType) !== undefined;
};

const isParenthesized = (
    sourceCode: Readonly<TSESLint.SourceCode>,
    node: Readonly<es.Node>
): boolean => {
    const tokenBefore = sourceCode.getTokenBefore(node);
    const tokenAfter = sourceCode.getTokenAfter(node);
    if (tokenBefore === null || tokenAfter === null) {
        return false;
    }

    return (
        tokenBefore.value === "(" &&
        tokenBefore.range[1] <= node.range[0] &&
        tokenAfter.value === ")" &&
        tokenAfter.range[0] >= node.range[1]
    );
};

const replaceWithUnknownFix = (
    fixer: TSESLint.RuleFixer,
    typeAnnotation: Readonly<es.TSTypeAnnotation>
): TSESLint.RuleFix => fixer.replaceText(typeAnnotation, ": unknown");

const annotateImplicitParamFixes = (
    fixer: TSESLint.RuleFixer,
    sourceCode: Readonly<TSESLint.SourceCode>,
    parameter: Readonly<es.Identifier>
): readonly TSESLint.RuleFix[] => {
    if (isParenthesized(sourceCode, parameter)) {
        return [fixer.insertTextAfter(parameter, ": unknown")];
    }

    return [
        fixer.insertTextBefore(parameter, "("),
        fixer.insertTextAfter(parameter, ": unknown)"),
    ];
};

/**
 * Require explicit `unknown` (or optionally `any`) for Promise rejection
 * callbacks.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => {
        const parserServices = ESLintUtils.getParserServices(context);
        const sourceCode = context.sourceCode;
        const typeChecker = parserServices.program.getTypeChecker();
        const [{ allowExplicitAny = false } = {}] = context.options;

        const checkRejectionCallback = (
            callExpression: Readonly<es.CallExpression>,
            callback: Readonly<es.CallExpressionArgument>
        ): void => {
            if (
                callback.type !== "ArrowFunctionExpression" &&
                callback.type !== "FunctionExpression"
            ) {
                return;
            }

            const [parameter] = callback.params;
            if (parameter?.type !== "Identifier") {
                return;
            }

            if (
                !isPromiseRejectionCall(
                    callExpression,
                    parserServices,
                    typeChecker
                )
            ) {
                return;
            }

            if (parameter.typeAnnotation === undefined) {
                context.report({
                    fix: (fixer) =>
                        annotateImplicitParamFixes(
                            fixer,
                            sourceCode,
                            parameter
                        ),
                    messageId: "implicitAny",
                    node: parameter,
                    suggest: [
                        {
                            fix: (fixer) =>
                                annotateImplicitParamFixes(
                                    fixer,
                                    sourceCode,
                                    parameter
                                ),
                            messageId: "suggestExplicitUnknown",
                        },
                    ],
                });
                return;
            }

            const { typeAnnotation } = parameter;
            const annotationType = typeAnnotation.typeAnnotation.type;
            if (annotationType === "TSUnknownKeyword") {
                return;
            }

            if (annotationType === "TSAnyKeyword") {
                if (allowExplicitAny) {
                    return;
                }

                context.report({
                    fix: (fixer) =>
                        replaceWithUnknownFix(fixer, typeAnnotation),
                    messageId: "explicitAny",
                    node: parameter,
                    suggest: [
                        {
                            fix: (fixer) =>
                                replaceWithUnknownFix(fixer, typeAnnotation),
                            messageId: "suggestExplicitUnknown",
                        },
                    ],
                });
                return;
            }

            context.report({
                messageId: "narrowed",
                node: parameter,
                suggest: [
                    {
                        fix: (fixer) =>
                            replaceWithUnknownFix(fixer, typeAnnotation),
                        messageId: "suggestExplicitUnknown",
                    },
                ],
            });
        };

        return {
            "CallExpression[callee.property.name='catch']": (
                callExpression: Readonly<es.CallExpression>
            ) => {
                const [callback] = callExpression.arguments;
                if (callback !== undefined) {
                    checkRejectionCallback(callExpression, callback);
                }
            },
            "CallExpression[callee.property.name='then']": (
                callExpression: Readonly<es.CallExpression>
            ) => {
                const callback = callExpression.arguments[1];
                if (callback !== undefined) {
                    checkRejectionCallback(callExpression, callback);
                }
            },
        };
    },
    defaultOptions,
    meta: {
        defaultOptions: [{}],
        docs: {
            description:
                "require explicit unknown for Promise rejection callback parameters.",
            recommended: false,
            requiresTypeChecking: true,
            suggestion: true,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-implicit-any-catch",
        },
        fixable: "code",
        hasSuggestions: true,
        messages: {
            explicitAny: "Explicit `any` in Promise rejection callback.",
            implicitAny: "Implicit `any` in Promise rejection callback.",
            narrowed:
                "Error type in Promise rejection callback must be `unknown` or `any`.",
            suggestExplicitUnknown:
                "Use `unknown` to force safe, explicit narrowing before access.",
        },
        schema: [
            {
                additionalProperties: false,
                description:
                    "Configuration for Promise rejection callback annotation enforcement.",
                properties: {
                    allowExplicitAny: {
                        description:
                            "Whether an explicit `any` annotation is allowed for rejection callback parameters.",
                        type: "boolean",
                    },
                },
                type: "object",
            },
        ],
        type: "suggestion",
    },
    name: "no-implicit-any-catch",
});

export default rule;
