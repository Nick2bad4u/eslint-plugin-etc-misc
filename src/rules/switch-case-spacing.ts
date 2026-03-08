import { createSelectorRule } from "../_internal/create-selector-rule";

const selector =
    "SwitchCase > :matches(:first-child:not([type='BlockStatement'])[loc.start.column!=7], :not(:first-child):not([type='BreakStatement'])[loc.start.column!=8], :last-child:not([type='BreakStatement']))";

/**
 * Enforce consistent spacing and break placement inside switch cases.
 */
const rule: ReturnType<typeof createSelectorRule> = createSelectorRule({
    description: "enforce consistent spacing and break placement in switch cases.",
    message: "Case body should start on a new line and end with break.",
    messageId: "forbidden",
    name: "switch-case-spacing",
    selector,
    type: "suggestion",
    url: "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/switch-case-spacing.md",
});

export default rule;
