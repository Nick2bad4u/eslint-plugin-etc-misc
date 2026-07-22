import {
    AST_NODE_TYPES,
    type TSESTree as es,
    TSESLint,
} from "@typescript-eslint/utils";
import { arrayFirst, isDefined } from "ts-extras";

import { ruleCreator } from "../_internal/rule-creator.js";
import { withDeprecatedRuleLifecycle } from "../_internal/rule-deprecation.js";

type MessageIds = "forbidden";

type Options = readonly [];

const selector =
    "AssignmentExpression[operator='='] > MemberExpression.left > Identifier.object";

const findVariable = (
    sourceCode: Readonly<TSESLint.SourceCode>,
    identifier: Readonly<es.Identifier>
): Readonly<TSESLint.Scope.Variable> | undefined => {
    let scope: null | TSESLint.Scope.Scope = sourceCode.getScope(identifier);

    while (scope !== null) {
        const variable = scope.set.get(identifier.name);

        if (isDefined(variable)) {
            return variable;
        }

        scope = scope.upper;
    }

    return undefined;
};

const isLocallyDeclaredFunction = (
    sourceCode: Readonly<TSESLint.SourceCode>,
    identifier: Readonly<es.Identifier>
): boolean => {
    const variable = findVariable(sourceCode, identifier);

    if (variable?.defs.length !== 1) {
        return false;
    }

    const definition = arrayFirst(variable.defs);

    if (definition?.type === TSESLint.Scope.DefinitionType.FunctionName) {
        return true;
    }

    if (
        definition?.type !== TSESLint.Scope.DefinitionType.Variable ||
        definition.node.id.type !== AST_NODE_TYPES.Identifier
    ) {
        return false;
    }

    return (
        definition.node.init?.type === AST_NODE_TYPES.ArrowFunctionExpression ||
        definition.node.init?.type === AST_NODE_TYPES.FunctionExpression
    );
};

/**
 * Require defining function properties in a single statement.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => ({
        [selector]: (node: Readonly<es.Node>): void => {
            if (
                node.type !== AST_NODE_TYPES.Identifier ||
                !isLocallyDeclaredFunction(context.sourceCode, node)
            ) {
                return;
            }

            context.report({
                messageId: "forbidden",
                node,
            });
        },
    }),
    meta: {
        deprecated: true,
        docs: {
            deprecated: true,
            description:
                "require defining function properties in a single statement.",
            frozen: true,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-define-function-in-one-statement",
        },
        hasSuggestions: false,
        languages: ["js/js"],
        messages: {
            forbidden:
                "Use `Object.assign` to define function properties in one statement.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "typescript/define-function-in-one-statement",
});

/**
 * Wrapper rule with explicit lifecycle metadata.
 */
const deprecatedRule: typeof rule = withDeprecatedRuleLifecycle(rule, {
    deprecatedSince: "3.0.0",
    message:
        "Deprecated without replacement because this style policy is too narrow and error-prone.",
    ruleId: "typescript/define-function-in-one-statement",
});

export default deprecatedRule;
