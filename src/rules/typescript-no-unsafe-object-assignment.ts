import coreNoUnsafeObjectAssignRule from "./typescript-no-unsafe-object-assign";

/**
 * TypeScript-prefixed alias for Object.assign readonly-target safety checks.
 */
const rule: typeof coreNoUnsafeObjectAssignRule = coreNoUnsafeObjectAssignRule;

export default rule;
