import { createSelectorRule } from "../_internal/create-selector-rule";

/**
 * Require defining function properties in a single statement.
 */
const rule: ReturnType<typeof createSelectorRule> = createSelectorRule({
    description: "require defining function properties in a single statement.",
    message:
        'Use `Object.assign` to define function properties in one statement.',
    messageId: "forbidden",
    name: "typescript/define-function-in-one-statement",
    selector:
        "AssignmentExpression > MemberExpression.left > Identifier.object",
    type: "suggestion",
    url: "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/typescript-define-function-in-one-statement.md",
});

export default rule;
