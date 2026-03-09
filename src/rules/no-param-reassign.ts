import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden";

type Options = readonly [];

type Scope = TSESLint.Scope.Scope;

type SourceCode = TSESLint.SourceCode;

type Variable = TSESLint.Scope.Variable;

const getAssignmentTargetIdentifier = (
    node: Readonly<es.AssignmentExpression>
): Readonly<es.Identifier> | undefined => {
    if (node.left.type === "Identifier") {
        return node.left;
    }

    return undefined;
};

const getScopeVariable = (
    sourceCode: Readonly<SourceCode>,
    identifier: Readonly<es.Identifier>
): Readonly<Variable> | undefined => {
    let scope: null | Scope = sourceCode.getScope(identifier);

    while (scope !== null) {
        const variable = scope.set.get(identifier.name);
        if (variable !== undefined) {
            return variable;
        }

        scope = scope.upper;
    }

    return undefined;
};

const isParameterVariable = (
    variable: Readonly<Variable> | undefined
): boolean =>
    variable?.defs.some((definition) => definition.type === "Parameter") ??
    false;

const isInFirstFunctionExpressionStatement = (
    sourceCode: Readonly<SourceCode>,
    node: Readonly<es.Node>
): boolean => {
    const ancestors = sourceCode.getAncestors(node);
    let enclosingFunction:
        | es.ArrowFunctionExpression
        | es.FunctionDeclaration
        | es.FunctionExpression
        | undefined = undefined;

    for (let index = ancestors.length - 1; index >= 0; index -= 1) {
        const ancestor = ancestors[index];
        if (ancestor === undefined) {
            continue;
        }

        if (
            ancestor.type === "ArrowFunctionExpression" ||
            ancestor.type === "FunctionDeclaration" ||
            ancestor.type === "FunctionExpression"
        ) {
            enclosingFunction = ancestor;
            break;
        }
    }

    if (enclosingFunction?.body.type !== "BlockStatement") {
        return false;
    }

    const [firstStatement] = enclosingFunction.body.body;
    if (firstStatement?.type !== "ExpressionStatement") {
        return false;
    }

    return (
        node.range[0] >= firstStatement.range[0] &&
        node.range[1] <= firstStatement.range[1]
    );
};

/**
 * Disallow parameter reassignment, except in the first expression statement of
 * a function body.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => {
        const { sourceCode } = context;

        const reportIfParameterReassignment = (
            identifier: Readonly<es.Identifier>
        ): void => {
            if (isInFirstFunctionExpressionStatement(sourceCode, identifier)) {
                return;
            }

            const variable = getScopeVariable(sourceCode, identifier);
            if (!isParameterVariable(variable)) {
                return;
            }

            context.report({
                messageId: "forbidden",
                node: identifier,
            });
        };

        return {
            AssignmentExpression: (
                node: Readonly<es.AssignmentExpression>
            ): void => {
                const identifier = getAssignmentTargetIdentifier(node);
                if (identifier === undefined) {
                    return;
                }

                reportIfParameterReassignment(identifier);
            },
            UpdateExpression: (node: Readonly<es.UpdateExpression>): void => {
                if (node.argument.type !== "Identifier") {
                    return;
                }

                reportIfParameterReassignment(node.argument);
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "disallow parameter reassignment except in the first expression statement of a function body.",
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-param-reassign",
        },
        hasSuggestions: false,
        messages: {
            forbidden:
                "Do not reassign function parameters outside the first expression statement in the function body.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-param-reassign",
});

export default rule;
