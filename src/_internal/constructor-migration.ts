import type { TSESTree as es } from "@typescript-eslint/utils";

import { AST_NODE_TYPES } from "@typescript-eslint/utils";

/** A direct assignment expression and its containing constructor statement. */
export type DirectConstructorAssignment = Readonly<{
    readonly assignment: es.AssignmentExpression;
    readonly statement: es.ExpressionStatement;
}>;

/**
 * Return direct expression-statement assignments from a concrete constructor.
 */
export const getDirectConstructorAssignments = (
    constructorDefinition: Readonly<es.MethodDefinition>
): readonly DirectConstructorAssignment[] => {
    const body = constructorDefinition.value.body;
    if (body === null) {
        return [];
    }

    return body.body.flatMap((statement) =>
        statement.type === AST_NODE_TYPES.ExpressionStatement &&
        statement.expression.type === AST_NODE_TYPES.AssignmentExpression &&
        statement.expression.operator === "="
            ? [
                  {
                      assignment: statement.expression,
                      statement,
                  },
              ]
            : []
    );
};

/**
 * Resolve a non-computed `this.name` expression.
 */
export const getStaticThisMemberName = (
    expression: Readonly<es.Expression>
): null | string =>
    expression.type === AST_NODE_TYPES.MemberExpression &&
    !expression.computed &&
    expression.object.type === AST_NODE_TYPES.ThisExpression &&
    expression.property.type === AST_NODE_TYPES.Identifier
        ? expression.property.name
        : null;

/**
 * Resolve the class that owns a method definition.
 */
export const getOwningClass = (
    methodDefinition: Readonly<es.MethodDefinition>
): es.ClassDeclaration | es.ClassExpression => methodDefinition.parent.parent;
