import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import { arrayFirst, arrayLast, setHas } from "ts-extras";

import {
    getDirectConstructorAssignments,
    getOwningClass,
    getStaticThisMemberName,
} from "../_internal/constructor-migration.js";
import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "moveStateToField" | "preferStateField";
type Options = readonly [];

const magicInitializerNames = new Set([
    "Infinity",
    "NaN",
    "undefined",
]);

const isSimpleInitializer = (expression: Readonly<es.Node>): boolean => {
    if (expression.type === AST_NODE_TYPES.Literal) {
        return true;
    }

    if (expression.type === AST_NODE_TYPES.Identifier) {
        return setHas(magicInitializerNames, expression.name);
    }

    if (expression.type === AST_NODE_TYPES.ArrayExpression) {
        return expression.elements.every(
            (element) =>
                element !== null &&
                element.type !== AST_NODE_TYPES.SpreadElement &&
                isSimpleInitializer(element)
        );
    }

    if (expression.type !== AST_NODE_TYPES.ObjectExpression) {
        return false;
    }

    return expression.properties.every((property) => {
        if (
            property.type !== AST_NODE_TYPES.Property ||
            property.kind !== "init" ||
            property.method ||
            property.value.type === AST_NODE_TYPES.ArrayPattern ||
            property.value.type === AST_NODE_TYPES.AssignmentPattern ||
            property.value.type === AST_NODE_TYPES.ObjectPattern
        ) {
            return false;
        }

        return isSimpleInitializer(property.value);
    });
};

const hasRelocationSensitiveSyntax = (
    expression: Readonly<es.Node>
): boolean => {
    if (expression.type === AST_NODE_TYPES.Identifier) {
        return true;
    }

    if (expression.type === AST_NODE_TYPES.ArrayExpression) {
        return expression.elements.some(
            (element) =>
                element !== null &&
                element.type !== AST_NODE_TYPES.SpreadElement &&
                hasRelocationSensitiveSyntax(element)
        );
    }

    if (expression.type !== AST_NODE_TYPES.ObjectExpression) {
        return false;
    }

    return expression.properties.some(
        (property) =>
            property.type === AST_NODE_TYPES.Property &&
            (property.computed || hasRelocationSensitiveSyntax(property.value))
    );
};

const isSuperCallStatement = (statement: Readonly<es.Statement>): boolean =>
    statement.type === AST_NODE_TYPES.ExpressionStatement &&
    statement.expression.type === AST_NODE_TYPES.CallExpression &&
    statement.expression.callee.type === AST_NODE_TYPES.Super;

const canSuggestStateField = (
    constructorDefinition: Readonly<es.MethodDefinition>,
    statement: Readonly<es.ExpressionStatement>,
    initializer: Readonly<es.Expression>,
    sourceCode: Readonly<TSESLint.SourceCode>
): boolean => {
    if (
        !isSimpleInitializer(initializer) ||
        hasRelocationSensitiveSyntax(initializer)
    ) {
        return false;
    }

    if (sourceCode.getCommentsInside(statement).length > 0) {
        return false;
    }

    const owningClass = getOwningClass(constructorDefinition);
    const body = constructorDefinition.value.body;
    if (body === null) {
        return false;
    }

    const hasOtherFields = owningClass.body.body.some(
        (element) => element.type === AST_NODE_TYPES.PropertyDefinition
    );
    if (hasOtherFields) {
        return false;
    }

    if (owningClass.superClass === null) {
        return body.body.length === 1 && arrayFirst(body.body) === statement;
    }

    const firstStatement = arrayFirst(body.body);
    return (
        body.body.length === 2 &&
        arrayLast(body.body) === statement &&
        firstStatement !== undefined &&
        isSuperCallStatement(firstStatement)
    );
};

const buildStateFieldSuggestion = (
    fixer: TSESLint.RuleFixer,
    constructorDefinition: Readonly<es.MethodDefinition>,
    statement: Readonly<es.ExpressionStatement>,
    initializer: Readonly<es.Expression>,
    sourceCode: Readonly<TSESLint.SourceCode>
): readonly TSESLint.RuleFix[] => {
    const constructorLineStart =
        sourceCode.text.lastIndexOf(
            "\n",
            arrayFirst(constructorDefinition.range) - 1
        ) + 1;
    const linePrefix = sourceCode.text.slice(
        constructorLineStart,
        arrayFirst(constructorDefinition.range)
    );
    const indentation = /^\s*$/v.test(linePrefix) ? linePrefix : "";
    const separator = indentation === "" ? " " : `\n${indentation}`;
    const initializerText = sourceCode.getText(initializer);

    return [
        fixer.insertTextBefore(
            constructorDefinition,
            `state = ${initializerText};${separator}`
        ),
        fixer.remove(statement),
    ];
};

/**
 * Discourage assigning a simple initial state value in a constructor.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => ({
        "MethodDefinition[kind='constructor']": (
            constructorDefinition: Readonly<es.MethodDefinition>
        ): void => {
            for (const {
                assignment,
                statement,
            } of getDirectConstructorAssignments(constructorDefinition)) {
                if (
                    getStaticThisMemberName(assignment.left) !== "state" ||
                    !isSimpleInitializer(assignment.right)
                ) {
                    continue;
                }

                const canSuggest = canSuggestStateField(
                    constructorDefinition,
                    statement,
                    assignment.right,
                    context.sourceCode
                );

                if (canSuggest) {
                    context.report({
                        messageId: "preferStateField",
                        node: assignment,
                        suggest: [
                            {
                                fix: (fixer) =>
                                    buildStateFieldSuggestion(
                                        fixer,
                                        constructorDefinition,
                                        statement,
                                        assignment.right,
                                        context.sourceCode
                                    ),
                                messageId: "moveStateToField",
                            },
                        ],
                    });
                } else {
                    context.report({
                        messageId: "preferStateField",
                        node: assignment,
                    });
                }
            }
        },
    }),
    meta: {
        deprecated: false,
        docs: {
            deprecated: false,
            description:
                "disallow simple initial state assignments in constructors when a class field is preferred.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-constructor-state",
        },
        hasSuggestions: true,
        messages: {
            moveStateToField:
                "Move this simple initial state value to a class field.",
            preferStateField:
                "Avoid assigning simple initial state in the constructor; prefer a class field when initialization-order semantics are acceptable.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "no-constructor-state",
});

export default rule;
