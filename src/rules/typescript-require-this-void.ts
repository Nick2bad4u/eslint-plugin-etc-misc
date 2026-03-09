import { createSelectorRule } from "../_internal/create-selector-rule.js";

/**
 * Require static class methods to declare `this: void`.
 */
const rule: ReturnType<typeof createSelectorRule> = createSelectorRule({
    description: "require static class methods to declare `this: void`.",
    message: 'Add "this: void" to static method signatures.',
    messageId: "forbidden",
    name: "typescript/require-this-void",
    selector:
        "MethodDefinition[static=true] > FunctionExpression:not([params.0.name='this'][params.0.typeAnnotation.typeAnnotation.type='TSVoidKeyword'])",
    type: "problem",
    url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-require-this-void",
});

export default rule;
