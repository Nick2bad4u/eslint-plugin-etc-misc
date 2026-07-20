import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import { arrayFirst, arrayJoin, isDefined, setHas } from "ts-extras";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "focusedTest" | "forbiddenFunction";
type Options = readonly [RuleOptions];

type RuleOptions = Readonly<{
    readonly block?: readonly string[];
    readonly fix?: boolean;
    readonly focus?: readonly string[];
    readonly functions?: readonly string[];
}>;

/* eslint-disable perfectionist/sort-arrays -- Preserve the upstream framework matching order for recognizable defaults. */
const defaultBlocks = [
    "describe",
    "it",
    "context",
    "test",
    "tape",
    "fixture",
    "serial",
    "Feature",
    "Scenario",
    "Given",
    "And",
    "When",
    "Then",
] as const;
/* eslint-enable perfectionist/sort-arrays -- Re-enable after the intentional compatibility order. */

const defaultOptions = [
    {
        block: defaultBlocks,
        fix: false,
        focus: ["only"],
        functions: [],
    },
] as const satisfies Options;

const unwrapExpression = (
    expression: Readonly<es.Expression>
): Readonly<es.Expression> => {
    if (
        expression.type === AST_NODE_TYPES.ChainExpression ||
        expression.type === AST_NODE_TYPES.TSAsExpression ||
        expression.type === AST_NODE_TYPES.TSNonNullExpression ||
        expression.type === AST_NODE_TYPES.TSSatisfiesExpression ||
        expression.type === AST_NODE_TYPES.TSTypeAssertion
    ) {
        return unwrapExpression(expression.expression);
    }

    return expression;
};

const getStaticMemberName = (
    memberExpression: Readonly<es.MemberExpression>
): null | string =>
    !memberExpression.computed &&
    memberExpression.property.type === AST_NODE_TYPES.Identifier
        ? memberExpression.property.name
        : null;

const getCallPath = (
    rawExpression: Readonly<es.Expression>
): null | readonly string[] => {
    const expression = unwrapExpression(rawExpression);

    if (expression.type === AST_NODE_TYPES.Identifier) {
        return [expression.name];
    }

    if (expression.type === AST_NODE_TYPES.CallExpression) {
        return getCallPath(expression.callee);
    }

    if (expression.type !== AST_NODE_TYPES.MemberExpression) {
        return null;
    }

    const propertyName = getStaticMemberName(expression);
    const objectPath = getCallPath(expression.object);

    return propertyName === null || objectPath === null
        ? null
        : [...objectPath, propertyName];
};

const matchesBlock = (callPath: string, block: string): boolean =>
    block.endsWith("*")
        ? callPath.startsWith(block.slice(0, -1))
        : callPath.startsWith(`${block}.`);

const getSafeFocusFix = (
    sourceCode: Readonly<TSESLint.SourceCode>,
    callExpression: Readonly<es.CallExpression>,
    memberExpression: Readonly<es.MemberExpression>
): ((fixer: TSESLint.RuleFixer) => null | TSESLint.RuleFix) | undefined => {
    if (
        memberExpression.computed ||
        memberExpression.optional ||
        callExpression.optional ||
        memberExpression.property.type !== AST_NODE_TYPES.Identifier
    ) {
        return undefined;
    }

    const property = memberExpression.property;
    const tokenBeforeProperty = sourceCode.getTokenBefore(property);

    if (
        tokenBeforeProperty?.value !== "." ||
        sourceCode.text.slice(
            arrayFirst(tokenBeforeProperty.range),
            property.range[1]
        ) !== `.${property.name}`
    ) {
        return undefined;
    }

    return (fixer) =>
        fixer.removeRange([
            arrayFirst(tokenBeforeProperty.range),
            property.range[1],
        ]);
};

/**
 * Disallow focused test invocations such as `test.only(...)`.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context, [options]) => {
        const blocks = options.block ?? defaultBlocks;
        const focusedNames = new Set(options.focus ?? ["only"]);
        const forbiddenFunctions = new Set(options.functions);

        return {
            CallExpression: (
                callExpression: Readonly<es.CallExpression>
            ): void => {
                const callee = unwrapExpression(callExpression.callee);

                if (
                    callee.type === AST_NODE_TYPES.Identifier &&
                    setHas(forbiddenFunctions, callee.name)
                ) {
                    context.report({
                        data: { functionName: callee.name },
                        messageId: "forbiddenFunction",
                        node: callee,
                    });

                    return;
                }

                if (callee.type !== AST_NODE_TYPES.MemberExpression) {
                    return;
                }

                const focusName = getStaticMemberName(callee);
                if (focusName === null || !setHas(focusedNames, focusName)) {
                    return;
                }

                const callPathParts = getCallPath(callee);
                if (callPathParts === null) {
                    return;
                }

                const callPath = arrayJoin(callPathParts, ".");
                if (blocks.every((block) => !matchesBlock(callPath, block))) {
                    return;
                }

                const safeFix =
                    options.fix === true
                        ? getSafeFocusFix(
                              context.sourceCode,
                              callExpression,
                              callee
                          )
                        : undefined;

                if (isDefined(safeFix)) {
                    context.report({
                        data: { callPath },
                        fix: safeFix,
                        messageId: "focusedTest",
                        node: callee,
                    });
                } else {
                    context.report({
                        data: { callPath },
                        messageId: "focusedTest",
                        node: callee,
                    });
                }
            },
        };
    },
    defaultOptions,
    meta: {
        defaultOptions: [
            {
                block: defaultBlocks,
                fix: false,
                focus: ["only"],
                functions: [],
            },
        ],
        deprecated: false,
        docs: {
            deprecated: false,
            description: "disallow focused test invocations.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-only-tests",
        },
        fixable: "code",
        hasSuggestions: false,
        messages: {
            focusedTest:
                "Focused test invocation '{{callPath}}' is not permitted; remove the focus method before committing.",
            forbiddenFunction:
                "Focused test function '{{functionName}}' is not permitted; use the non-focused test API.",
        },
        schema: [
            {
                additionalProperties: false,
                properties: {
                    block: {
                        description:
                            "Test API roots or wildcard prefixes that may contain focus methods.",
                        items: { minLength: 1, type: "string" },
                        type: "array",
                        uniqueItems: true,
                    },
                    fix: {
                        description:
                            "Whether to remove a safely recognized focus member automatically.",
                        type: "boolean",
                    },
                    focus: {
                        description:
                            "Member names that mark a test invocation as focused.",
                        items: { minLength: 1, type: "string" },
                        type: "array",
                        uniqueItems: true,
                    },
                    functions: {
                        description:
                            "Standalone function names that always represent focused tests.",
                        items: { minLength: 1, type: "string" },
                        type: "array",
                        uniqueItems: true,
                    },
                },
                type: "object",
            },
        ],
        type: "problem",
    },
    name: "no-only-tests",
});

export default rule;
