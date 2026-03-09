import { createSelectorRule } from "../_internal/create-selector-rule.js";

/**
 * Require defining function properties in a single statement.
 */
const rule: ReturnType<typeof createSelectorRule> = createSelectorRule({
    description: "require defining function properties in a single statement.",
    message:
        "Use `Object.assign` to define function properties in one statement.",
    messageId: "forbidden",
    name: "typescript/define-function-in-one-statement",
    selector:
        "AssignmentExpression > MemberExpression.left > Identifier.object",
    type: "suggestion",
    url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-define-function-in-one-statement",
});

export default rule;
