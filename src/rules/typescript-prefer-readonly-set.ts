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
    url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-prefer-readonly-set",
});

export default rule;
