import { createSelectorRule } from "../_internal/create-selector-rule.js";

/**
 * Require ReadonlyMap in place of Map type annotations.
 */
const rule: ReturnType<typeof createSelectorRule> = createSelectorRule({
    description: "require ReadonlyMap instead of Map in type annotations.",
    message: "Prefer readonly map types.",
    messageId: "forbidden",
    name: "typescript/prefer-readonly-map",
    selector: "TSTypeReference > Identifier[name='Map']",
    type: "suggestion",
    url: "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/typescript-prefer-readonly-map.md",
});

export default rule;
