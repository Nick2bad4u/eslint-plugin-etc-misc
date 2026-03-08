/* eslint-disable canonical/no-re-export -- Rules map intentionally references imported rule implementations. */

import type { TSESLint } from "@typescript-eslint/utils";

import noAssignMutatedArray from "./rules/no-assign-mutated-array";
import noCommentedOutCode from "./rules/no-commented-out-code";
import noConstEnum from "./rules/no-const-enum";
import noDeprecated from "./rules/no-deprecated";
import noEnum from "./rules/no-enum";
import noForeach from "./rules/no-foreach";
import noImplicitAnyCatch from "./rules/no-implicit-any-catch";
import noInternal from "./rules/no-internal";
import noT from "./rules/no-t";
import preferLessThan from "./rules/prefer-less-than";
import underscoreInternal from "./rules/underscore-internal";

type RuleModule = TSESLint.RuleModule<string, readonly unknown[]>;

/**
 * Rule implementations keyed by rule name.
 */
export const rules: Readonly<Record<string, RuleModule>> = {
    "no-assign-mutated-array": noAssignMutatedArray,
    "no-commented-out-code": noCommentedOutCode,
    "no-const-enum": noConstEnum,
    "no-deprecated": noDeprecated,
    "no-enum": noEnum,
    "no-foreach": noForeach,
    "no-implicit-any-catch": noImplicitAnyCatch,
    "no-internal": noInternal,
    "no-t": noT,
    "prefer-less-than": preferLessThan,
    "underscore-internal": underscoreInternal,
};

/* eslint-enable canonical/no-re-export -- Re-enable canonical re-export restriction outside this intentional map. */
