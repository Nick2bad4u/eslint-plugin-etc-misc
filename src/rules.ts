/* eslint-disable canonical/no-re-export -- Rules map intentionally references imported rule implementations. */

import type { TSESLint } from "@typescript-eslint/utils";

import matchFilenameRule from "./rules/class-match-filename";
import consistentSourceExtension from "./rules/consistent-source-extension";
import consistentSymbolDescription from "./rules/consistent-symbol-description";
import maxIdentifierBlocks from "./rules/max-identifier-blocks";
import noAssignMutatedArray from "./rules/no-assign-mutated-array";
import noAtSignImport from "./rules/no-at-sign-import";
import noAtSignInternalImport from "./rules/no-at-sign-internal-import";
import noChainCoalescenceMixture from "./rules/no-chain-coalescence-mixture";
import noCommentedOutCode from "./rules/no-commented-out-code";
import noConstEnum from "./rules/no-const-enum";
import noDeprecated from "./rules/no-deprecated";
import noEnum from "./rules/no-enum";
import noForeach from "./rules/no-foreach";
import noImplicitAnyCatch from "./rules/no-implicit-any-catch";
import noIndexImport from "./rules/no-index-import";
import noInternal from "./rules/no-internal";
import noInternalModules from "./rules/no-internal-modules";
import noLanguageMixing from "./rules/no-language-mixing";
import noMisusedGenerics from "./rules/no-misused-generics";
import noNegatedConditions from "./rules/no-negated-conditions";
import noNodejsModules from "./rules/no-nodejs-modules";
import noParamReassign from "./rules/no-param-reassign";
import noRelativeParentImport from "./rules/no-relative-parent-import";
import noShadow from "./rules/no-shadow";
import noT from "./rules/no-t";
import noUnderscoreExport from "./rules/no-underscore-export";
import noUnnecessaryAsConst from "./rules/no-unnecessary-as-const";
import noUnnecessaryBreak from "./rules/no-unnecessary-break";
import noUnnecessaryInitialization from "./rules/no-unnecessary-initialization";
import preferArrowFunctionProperty from "./rules/prefer-arrow-function-property";
import preferConstRequire from "./rules/prefer-const-require";
import preferInterface from "./rules/prefer-interface";
import preferLessThan from "./rules/prefer-less-than";
import restrictIdentifierCharacters from "./rules/restrict-identifier-characters";
import sortCallSignature from "./rules/sort-call-signature";
import sortConstructSignature from "./rules/sort-construct-signature";
import throwError from "./rules/throw-error";
import typescriptDefineFunctionInOneStatement from "./rules/typescript-define-function-in-one-statement";
import typescriptNoBooleanLiteralType from "./rules/typescript-no-boolean-literal-type";
import typescriptNoEmptyInterfaces from "./rules/typescript-no-empty-interfaces";
import typescriptPreferClassMethod from "./rules/typescript-prefer-class-method";
import typescriptPreferReadonlyArray from "./rules/typescript-prefer-readonly-array";
import typescriptPreferReadonlyMap from "./rules/typescript-prefer-readonly-map";
import typescriptPreferReadonlyProperty from "./rules/typescript-prefer-readonly-property";
import typescriptPreferReadonlySet from "./rules/typescript-prefer-readonly-set";
import typescriptRequirePropTypeAnnotation from "./rules/typescript-require-prop-type-annotation";
import typescriptRequireThisVoid from "./rules/typescript-require-this-void";
import underscoreInternal from "./rules/underscore-internal";

type RuleModule = TSESLint.RuleModule<string, readonly unknown[]>;

/**
 * Rule implementations keyed by rule name.
 */
export const rules: Readonly<Record<string, RuleModule>> = {
    "class-match-filename": matchFilenameRule,
    "consistent-source-extension": consistentSourceExtension,
    "consistent-symbol-description": consistentSymbolDescription,
    "max-identifier-blocks": maxIdentifierBlocks,
    "no-assign-mutated-array": noAssignMutatedArray,
    "no-at-sign-import": noAtSignImport,
    "no-at-sign-internal-import": noAtSignInternalImport,
    "no-chain-coalescence-mixture": noChainCoalescenceMixture,
    "no-commented-out-code": noCommentedOutCode,
    "no-const-enum": noConstEnum,
    "no-deprecated": noDeprecated,
    "no-enum": noEnum,
    "no-foreach": noForeach,
    "no-implicit-any-catch": noImplicitAnyCatch,
    "no-index-import": noIndexImport,
    "no-internal": noInternal,
    "no-internal-modules": noInternalModules,
    "no-language-mixing": noLanguageMixing,
    "no-misused-generics": noMisusedGenerics,
    "no-negated-conditions": noNegatedConditions,
    "no-nodejs-modules": noNodejsModules,
    "no-param-reassign": noParamReassign,
    "no-relative-parent-import": noRelativeParentImport,
    "no-shadow": noShadow,
    "no-t": noT,
    "no-underscore-export": noUnderscoreExport,
    "no-unnecessary-as-const": noUnnecessaryAsConst,
    "no-unnecessary-break": noUnnecessaryBreak,
    "no-unnecessary-initialization": noUnnecessaryInitialization,
    "prefer-arrow-function-property": preferArrowFunctionProperty,
    "prefer-const-require": preferConstRequire,
    "prefer-interface": preferInterface,
    "prefer-less-than": preferLessThan,
    "restrict-identifier-characters": restrictIdentifierCharacters,
    "sort-call-signature": sortCallSignature,
    "sort-construct-signature": sortConstructSignature,
    "throw-error": throwError,
    "typescript/define-function-in-one-statement": typescriptDefineFunctionInOneStatement,
    "typescript/no-boolean-literal-type": typescriptNoBooleanLiteralType,
    "typescript/no-empty-interfaces": typescriptNoEmptyInterfaces,
    "typescript/prefer-class-method": typescriptPreferClassMethod,
    "typescript/prefer-readonly-array": typescriptPreferReadonlyArray,
    "typescript/prefer-readonly-map": typescriptPreferReadonlyMap,
    "typescript/prefer-readonly-property": typescriptPreferReadonlyProperty,
    "typescript/prefer-readonly-set": typescriptPreferReadonlySet,
    "typescript/require-prop-type-annotation": typescriptRequirePropTypeAnnotation,
    "typescript/require-this-void": typescriptRequireThisVoid,
    "underscore-internal": underscoreInternal,
};

/* eslint-enable canonical/no-re-export -- Re-enable canonical re-export restriction outside this intentional map. */
