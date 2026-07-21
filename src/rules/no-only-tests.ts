import {
    AST_NODE_TYPES,
    type TSESTree as es,
    TSESLint,
} from "@typescript-eslint/utils";
import { arrayFirst, arrayJoin, isDefined, setHas } from "ts-extras";

import { findVariable } from "../_internal/jsx-react-analysis.js";
import { ruleCreator } from "../_internal/rule-creator.js";

type CallPath = Readonly<{
    readonly members: readonly MemberSegment[];
    readonly root: Readonly<es.Identifier>;
}>;
type ImportBinding = Readonly<{
    readonly kind:
        | "default"
        | "named"
        | "namespace";
    readonly name?: string;
    readonly source: string;
}>;

type MemberSegment = Readonly<{
    readonly member: Readonly<es.MemberExpression>;
    readonly name: string;
}>;

type MessageIds = "focusedTest" | "forbiddenFunction";

type Options = readonly [RuleOptions];

type RuleOptions = Readonly<{
    readonly block?: readonly string[];
    readonly fix?: boolean;
    readonly focus?: readonly string[];
    readonly functions?: readonly string[];
}>;

/* eslint-disable perfectionist/sort-arrays -- Preserve the framework matching order for recognizable defaults. */
const defaultBlocks = [
    "describe",
    "it",
    "context",
    "test",
    "bench",
    "suite",
    "QUnit",
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

const defaultFocusedFunctions = ["fdescribe", "fit"] as const;

const defaultOptions = [
    {
        block: defaultBlocks,
        fix: false,
        focus: ["only"],
        functions: defaultFocusedFunctions,
    },
] as const satisfies Options;

const supportedFrameworkSources: ReadonlySet<string> = new Set([
    "@jest/globals",
    "@playwright/test",
    "ava",
    "bun:test",
    "mocha",
    "node:test",
    "qunit",
    "tape",
    "vitest",
]);

const defaultImportRoots: ReadonlyMap<string, string> = new Map([
    ["ava", "test"],
    ["node:test", "test"],
    ["qunit", "QUnit"],
    ["tape", "tape"],
]);

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
): string | undefined => {
    if (
        !memberExpression.computed &&
        memberExpression.property.type === AST_NODE_TYPES.Identifier
    ) {
        return memberExpression.property.name;
    }

    return memberExpression.computed &&
        memberExpression.property.type === AST_NODE_TYPES.Literal &&
        typeof memberExpression.property.value === "string"
        ? memberExpression.property.value
        : undefined;
};

const getCallPath = (
    rawExpression: Readonly<es.Expression>
): CallPath | undefined => {
    const expression = unwrapExpression(rawExpression);

    if (expression.type === AST_NODE_TYPES.Identifier) {
        return { members: [], root: expression };
    }

    if (expression.type === AST_NODE_TYPES.CallExpression) {
        return getCallPath(expression.callee);
    }

    if (expression.type !== AST_NODE_TYPES.MemberExpression) {
        return undefined;
    }

    const propertyName = getStaticMemberName(expression);
    const objectPath = getCallPath(expression.object);

    return !isDefined(propertyName) || !isDefined(objectPath)
        ? undefined
        : {
              members: [
                  ...objectPath.members,
                  { member: expression, name: propertyName },
              ],
              root: objectPath.root,
          };
};

const getImportedName = (
    specifier: Readonly<es.ImportSpecifier>
): string | undefined =>
    specifier.imported.type === AST_NODE_TYPES.Identifier
        ? specifier.imported.name
        : typeof specifier.imported.value === "string"
          ? specifier.imported.value
          : undefined;

const getImportBinding = (
    sourceCode: Readonly<TSESLint.SourceCode>,
    identifier: Readonly<es.Identifier>
): ImportBinding | undefined => {
    const variable = findVariable(sourceCode, identifier);
    const definition = arrayFirst(variable?.defs ?? []);

    if (
        variable?.defs.length !== 1 ||
        definition?.type !== TSESLint.Scope.DefinitionType.ImportBinding ||
        definition.parent.type !== AST_NODE_TYPES.ImportDeclaration ||
        definition.parent.importKind === "type" ||
        typeof definition.parent.source.value !== "string" ||
        !setHas(supportedFrameworkSources, definition.parent.source.value) ||
        definition.node.type === AST_NODE_TYPES.TSImportEqualsDeclaration
    ) {
        return undefined;
    }

    const source = definition.parent.source.value;

    if (definition.node.type === AST_NODE_TYPES.ImportSpecifier) {
        const name = getImportedName(definition.node);

        return isDefined(name) ? { kind: "named", name, source } : undefined;
    }

    return {
        kind:
            definition.node.type === AST_NODE_TYPES.ImportDefaultSpecifier
                ? "default"
                : "namespace",
        source,
    };
};

const isUnshadowedGlobal = (
    sourceCode: Readonly<TSESLint.SourceCode>,
    identifier: Readonly<es.Identifier>
): boolean => {
    const variable = findVariable(sourceCode, identifier);

    return !isDefined(variable) || variable.defs.length === 0;
};

const resolveCanonicalCallPath = (
    sourceCode: Readonly<TSESLint.SourceCode>,
    callPath: Readonly<CallPath>,
    trustConfiguredBlocks: boolean
): readonly string[] | undefined => {
    const rawParts = [
        callPath.root.name,
        ...callPath.members.map(({ name }) => name),
    ];

    if (
        trustConfiguredBlocks ||
        isUnshadowedGlobal(sourceCode, callPath.root)
    ) {
        return rawParts;
    }

    const binding = getImportBinding(sourceCode, callPath.root);

    if (!isDefined(binding)) {
        return undefined;
    }

    if (binding.kind === "named") {
        return [binding.name ?? callPath.root.name, ...rawParts.slice(1)];
    }

    if (binding.kind === "namespace") {
        return rawParts.length > 1 ? rawParts.slice(1) : undefined;
    }

    const defaultRoot = defaultImportRoots.get(binding.source);

    return isDefined(defaultRoot)
        ? [defaultRoot, ...rawParts.slice(1)]
        : undefined;
};

const resolveStandaloneFunctionName = (
    sourceCode: Readonly<TSESLint.SourceCode>,
    identifier: Readonly<es.Identifier>,
    trustConfiguredFunctions: boolean
): string | undefined => {
    if (
        trustConfiguredFunctions ||
        isUnshadowedGlobal(sourceCode, identifier)
    ) {
        return identifier.name;
    }

    const binding = getImportBinding(sourceCode, identifier);

    return binding?.kind === "named" ? binding.name : undefined;
};

const matchesBlock = (callPath: string, block: string): boolean =>
    block.endsWith("*")
        ? callPath.startsWith(block.slice(0, -1))
        : callPath.startsWith(`${block}.`);

const matchesDefaultNames = (
    names: readonly string[],
    defaults: readonly string[]
): boolean =>
    names.length === defaults.length &&
    names.every((name, index) => name === defaults[index]);

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
        const forbiddenFunctions = new Set(
            options.functions ?? defaultFocusedFunctions
        );
        const reportedFocusMembers = new Set<Readonly<es.MemberExpression>>();
        const trustConfiguredBlocks = !matchesDefaultNames(
            blocks,
            defaultBlocks
        );
        const trustConfiguredFunctions = !matchesDefaultNames(
            options.functions ?? defaultFocusedFunctions,
            defaultFocusedFunctions
        );

        return {
            CallExpression: (
                callExpression: Readonly<es.CallExpression>
            ): void => {
                const callee = unwrapExpression(callExpression.callee);

                if (callee.type === AST_NODE_TYPES.Identifier) {
                    const canonicalFunctionName = resolveStandaloneFunctionName(
                        context.sourceCode,
                        callee,
                        trustConfiguredFunctions
                    );

                    if (
                        isDefined(canonicalFunctionName) &&
                        setHas(forbiddenFunctions, canonicalFunctionName)
                    ) {
                        context.report({
                            data: { functionName: callee.name },
                            messageId: "forbiddenFunction",
                            node: callee,
                        });
                    }

                    return;
                }

                const callPath = getCallPath(callee);

                if (!isDefined(callPath)) {
                    return;
                }

                const canonicalParts = resolveCanonicalCallPath(
                    context.sourceCode,
                    callPath,
                    trustConfiguredBlocks
                );

                if (!isDefined(canonicalParts)) {
                    return;
                }

                const canonicalCallPath = arrayJoin(canonicalParts, ".");

                if (
                    blocks.every(
                        (block) => !matchesBlock(canonicalCallPath, block)
                    )
                ) {
                    return;
                }

                for (const segment of callPath.members) {
                    if (
                        !setHas(focusedNames, segment.name) ||
                        setHas(reportedFocusMembers, segment.member)
                    ) {
                        continue;
                    }

                    reportedFocusMembers.add(segment.member);

                    const safeFix =
                        options.fix === true
                            ? getSafeFocusFix(
                                  context.sourceCode,
                                  callExpression,
                                  segment.member
                              )
                            : undefined;
                    const reportDescriptor = {
                        data: { callPath: canonicalCallPath },
                        messageId: "focusedTest" as const,
                        node: segment.member,
                    };

                    context.report(
                        isDefined(safeFix)
                            ? { ...reportDescriptor, fix: safeFix }
                            : reportDescriptor
                    );
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
                functions: defaultFocusedFunctions,
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
        languages: ["js/js"],
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
                            "Standalone function names that represent focused tests.",
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
