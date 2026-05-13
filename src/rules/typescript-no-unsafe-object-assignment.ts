import { assertDefined } from "ts-extras";

import rule from "./typescript-no-unsafe-object-assign.js";

const coreNoUnsafeObjectAssignRule: typeof rule = rule;
const baseDocs = coreNoUnsafeObjectAssignRule.meta.docs;
assertDefined(baseDocs);

/**
 * TypeScript-prefixed alias for Object.assign readonly-target safety checks.
 */
const typescriptNoUnsafeObjectAssignmentRule: typeof coreNoUnsafeObjectAssignRule =
    {
        ...coreNoUnsafeObjectAssignRule,
        meta: {
            deprecated: false,
            ...coreNoUnsafeObjectAssignRule.meta,
            docs: {
                ...baseDocs,
                deprecated: false,
                frozen: false,
                recommended: false,
                url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-no-unsafe-object-assignment",
            },
        },
    };

export default typescriptNoUnsafeObjectAssignmentRule;
