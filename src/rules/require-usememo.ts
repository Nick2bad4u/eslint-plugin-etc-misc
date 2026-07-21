import {
    createReplacementRuleInfo,
    withDeprecatedRuleLifecycle,
} from "../_internal/rule-deprecation.js";
import canonicalRule from "./no-unstable-react-values.js";

const compatibilityAlias: typeof canonicalRule = {
    ...canonicalRule,
    // eslint-disable-next-line @typescript-eslint/unbound-method -- Rule create callbacks have no receiver state; preserving identity makes this a true alias.
    create: canonicalRule.create,
    meta: {
        ...canonicalRule.meta,
        docs: {
            ...canonicalRule.meta.docs,
            description: "deprecated alias for no-unstable-react-values.",
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/require-usememo",
        },
    },
};

/** Preserve the historical rule ID as a compatibility alias through v3. */
const rule: typeof compatibilityAlias = withDeprecatedRuleLifecycle(
    compatibilityAlias,
    {
        availableUntil: "3.0.0",
        deprecatedSince: "2.0.0",
        message:
            "Deprecated compatibility alias. Use no-unstable-react-values instead.",
        replacedBy: [
            createReplacementRuleInfo({
                rule: {
                    name: "no-unstable-react-values",
                    url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-unstable-react-values",
                },
            }),
        ],
        ruleId: "require-usememo",
    }
);

export default rule;
