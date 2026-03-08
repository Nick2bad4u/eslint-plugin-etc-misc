import type {
    TSESTree as es,
    TSESLint,
} from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator";

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
 * Disallow variable declarations that shadow identifiers from parent scopes, excluding enum declarations.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> =
    ruleCreator<Options, MessageIds>({
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
                        if (shadowed === undefined || shouldIgnoreVariable(shadowed)) {
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
        defaultOptions: [],
        meta: {
            docs: {
                description:
                    "disallow shadowed variables while ignoring enum declarations.",
                recommended: false,
                url: "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/no-shadow.md",
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

export default rule;
