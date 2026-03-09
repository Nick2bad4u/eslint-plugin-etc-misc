import { createSelectorRule } from "../_internal/create-selector-rule.js";

/**
 * Require ReadonlySet in place of Set type annotations.
 */
const rule: ReturnType<typeof createSelectorRule> = createSelectorRule({
    description: "require ReadonlySet instead of Set in type annotations.",
    message: "Prefer readonly set types.",
    messageId: "forbidden",
    name: "typescript/prefer-readonly-set",
    selector: "TSTypeReference > Identifier[name='Set']",
    type: "suggestion",
    url: "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/typescript-prefer-readonly-set.md",
});

export default rule;
