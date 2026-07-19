import { assertDefined } from "ts-extras";

import {
    createReplacementRuleInfo,
    withDeprecatedRuleLifecycle,
} from "../_internal/rule-deprecation.js";
import rule from "./typescript-no-unsafe-object-assign.js";

const coreNoUnsafeObjectAssignRule: typeof rule = rule;
const baseDocs = coreNoUnsafeObjectAssignRule.meta.docs;
assertDefined(baseDocs);

/**
 * TypeScript-prefixed alias for Object.assign readonly-target safety checks.
 */
const compatibilityAlias: typeof coreNoUnsafeObjectAssignRule = {
    ...coreNoUnsafeObjectAssignRule,
    meta: {
        ...coreNoUnsafeObjectAssignRule.meta,
        docs: {
            ...baseDocs,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-no-unsafe-object-assignment",
        },
    },
};

/**
 * Deprecated compatibility alias for the canonical Object.assign rule.
 */
const typescriptNoUnsafeObjectAssignmentRule: typeof compatibilityAlias =
    withDeprecatedRuleLifecycle(compatibilityAlias, {
        deprecatedSince: "1.2.0",
        message:
            "Deprecated compatibility alias. Use typescript/no-unsafe-object-assign instead.",
        replacedBy: [
            createReplacementRuleInfo({
                rule: {
                    name: "typescript/no-unsafe-object-assign",
                    url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-no-unsafe-object-assign",
                },
            }),
        ],
        ruleId: "typescript/no-unsafe-object-assignment",
    });

export default typescriptNoUnsafeObjectAssignmentRule;
