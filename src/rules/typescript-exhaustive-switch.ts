import { createSelectorRule } from "../_internal/create-selector-rule";

const selector =
    "SwitchStatement[cases.length>1]:not(:has(SwitchCase[test=null]))";

/**
 * Require a default case in non-trivial switch statements.
 */
const rule: ReturnType<typeof createSelectorRule> = createSelectorRule({
    description: "require a default case in switch statements with multiple branches.",
    message: "Add a default case to make this switch exhaustive.",
    messageId: "forbidden",
    name: "typescript/exhaustive-switch",
    selector,
    type: "suggestion",
    url: "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/typescript-exhaustive-switch.md",
});

export default rule;
