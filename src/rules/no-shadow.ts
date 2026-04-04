import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";
import {
    createReplacementRuleInfo,
    withDeprecatedRuleLifecycle,
} from "../_internal/rule-deprecation.js";

type MessageIds = "forbidden";

type Options = readonly [];

type Scope = TSESLint.Scope.Scope;

type Variable = TSESLint.Scope.Variable;

const shouldIgnoreVariable = (variable: Readonly<Variable>): boolean =>
    variable.defs.some(
        (definition) =>
            definition.node.type === "TSEnumDeclaration" ||
            definition.type.includes("Enum")
    );

const findShadowedVariable = (
    scope: Readonly<Scope>,
    variableName: string
): Readonly<Variable> | undefined => {
    let upperScope = scope.upper;

    while (upperScope !== null) {
        const upperVariable = upperScope.set.get(variableName);
        if (upperVariable !== undefined) {
            return upperVariable;
        }

        upperScope = upperScope.upper;
    }

    return undefined;
};

const collectScopes = (scope: Readonly<Scope>): readonly Readonly<Scope>[] => [
    scope,
    ...scope.childScopes.flatMap((childScope) => collectScopes(childScope)),
];

/**
 * Disallow variable declarations that shadow identifiers from parent scopes,
 * excluding enum declarations.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => ({
        "Program:exit": (node: Readonly<es.Program>): void => {
            const programScope = context.sourceCode.getScope(node);

            for (const scope of collectScopes(programScope)) {
                for (const variable of scope.variables) {
                    if (shouldIgnoreVariable(variable)) {
                        continue;
                    }

                    const [identifier] = variable.identifiers;
                    if (identifier === undefined) {
                        continue;
                    }

                    const shadowed = findShadowedVariable(scope, variable.name);
                    if (
                        shadowed === undefined ||
                        shouldIgnoreVariable(shadowed)
                    ) {
                        continue;
                    }

                    context.report({
                        data: {
                            name: variable.name,
                        },
                        messageId: "forbidden",
                        node: identifier,
                    });
                }
            }
        },
    }),
    meta: {
        deprecated: true,
        docs: {
            deprecated: true,
            description:
                "disallow shadowed variables while ignoring enum declarations.",
            frozen: true,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-shadow",
        },
        hasSuggestions: false,
        messages: {
            forbidden:
                "'{{name}}' is already declared in an outer scope and should not be shadowed.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-shadow",
});

/**
 * Wrapper rule with explicit lifecycle metadata and replacement mapping.
 */
const deprecatedRule: typeof rule = withDeprecatedRuleLifecycle(rule, {
    message: "Deprecated in favor of @typescript-eslint/no-shadow.",
    replacedBy: [
        createReplacementRuleInfo({
            plugin: {
                name: "@typescript-eslint",
                url: "https://typescript-eslint.io/",
            },
            rule: {
                name: "no-shadow",
                url: "https://typescript-eslint.io/rules/no-shadow",
            },
        }),
    ],
    ruleId: "no-shadow",
});

export default deprecatedRule;
