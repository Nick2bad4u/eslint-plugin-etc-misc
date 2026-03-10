import coreNoUnsafeObjectAssignRule from "./typescript-no-unsafe-object-assign.js";

/**
 * TypeScript-prefixed alias for Object.assign readonly-target safety checks.
 */
const rule: typeof coreNoUnsafeObjectAssignRule = {
    ...coreNoUnsafeObjectAssignRule,
    meta: {
        deprecated: false,
        ...coreNoUnsafeObjectAssignRule.meta,
        docs: {
            deprecated: false,
            frozen: false,
            recommended: false,
            ...coreNoUnsafeObjectAssignRule.meta.docs,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-no-unsafe-object-assignment",
        } as NonNullable<typeof coreNoUnsafeObjectAssignRule.meta.docs>,
    },
};

export default rule;
