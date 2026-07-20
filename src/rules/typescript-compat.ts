import {
    createReplacementRuleInfo,
    withDeprecatedRuleLifecycle,
} from "../_internal/rule-deprecation.js";
import compatRule from "./compat.js";

const compatibilityAlias: typeof compatRule = {
    ...compatRule,
    // eslint-disable-next-line @typescript-eslint/unbound-method -- Rule create callbacks have no receiver state; preserving identity makes this a true alias.
    create: compatRule.create,
    meta: {
        ...compatRule.meta,
        docs: {
            ...compatRule.meta.docs,
            description:
                compatRule.meta.docs?.description ??
                "ensure cross-browser API compatibility.",
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-compat",
        },
    },
};

/** Preserve the historical nested rule ID as an exact compat alias. */
const rule: typeof compatibilityAlias = withDeprecatedRuleLifecycle(
    compatibilityAlias,
    {
        deprecatedSince: "1.3.0",
        message: "Deprecated compatibility alias. Use etc-misc/compat instead.",
        replacedBy: [
            createReplacementRuleInfo({
                rule: {
                    name: "compat",
                    url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/compat",
                },
            }),
        ],
        ruleId: "typescript/compat",
    }
);

export default rule;
