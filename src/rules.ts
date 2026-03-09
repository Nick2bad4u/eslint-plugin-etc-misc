/* eslint-disable canonical/no-re-export -- Rules map intentionally references imported rule implementations. */

import type { TSESLint } from "@typescript-eslint/utils";

import matchFilenameRule from "./rules/class-match-filename";
import commentSpacing from "./rules/comment-spacing";
import consistentEmptyLines from "./rules/consistent-empty-lines";
import consistentEnumMembers from "./rules/consistent-enum-members";
import consistentFilename from "./rules/consistent-filename";
import consistentImport from "./rules/consistent-import";
import consistentOptionalProps from "./rules/consistent-optional-props";
import consistentSourceExtension from "./rules/consistent-source-extension";
import consistentSymbolDescription from "./rules/consistent-symbol-description";
import disallowImport from "./rules/disallow-import";
import exportMatchingFilenameOnly from "./rules/export-matching-filename-only";
import matchFilename from "./rules/match-filename";
import maxIdentifierBlocks from "./rules/max-identifier-blocks";
import noAssignMutatedArray from "./rules/no-assign-mutated-array";
import noAtSignImport from "./rules/no-at-sign-import";
import noAtSignInternalImport from "./rules/no-at-sign-internal-import";
import noChainCoalescenceMixture from "./rules/no-chain-coalescence-mixture";
import noCommentedOutCode from "./rules/no-commented-out-code";
import noConstEnum from "./rules/no-const-enum";
import noDeprecated from "./rules/no-deprecated";
import noEnum from "./rules/no-enum";
import noExpressionEmptyLines from "./rules/no-expression-empty-lines";
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
import noRestrictedSyntax from "./rules/no-restricted-syntax";
import noSelfImport from "./rules/no-self-import";
import noShadow from "./rules/no-shadow";
import noSiblingImport from "./rules/no-sibling-import";
import noT from "./rules/no-t";
import noUnderscoreExport from "./rules/no-underscore-export";
import noUnnecessaryAsConst from "./rules/no-unnecessary-as-const";
import noUnnecessaryBreak from "./rules/no-unnecessary-break";
import noUnnecessaryInitialization from "./rules/no-unnecessary-initialization";
import noUnnecessaryTemplateLiteral from "./rules/no-unnecessary-template-literal";
import objectFormat from "./rules/object-format";
import onlyExportName from "./rules/only-export-name";
import preferArrowFunctionProperty from "./rules/prefer-arrow-function-property";
import preferConstRequire from "./rules/prefer-const-require";
import preferInterface from "./rules/prefer-interface";
import preferLessThan from "./rules/prefer-less-than";
import preferOnlyExport from "./rules/prefer-only-export";
import requireJSDoc from "./rules/require-jsdoc";
import requireSyntax from "./rules/require-syntax";
import restrictIdentifierCharacters from "./rules/restrict-identifier-characters";
import sortArray from "./rules/sort-array";
import sortCallSignature from "./rules/sort-call-signature";
import sortClassMembers from "./rules/sort-class-members";
import sortConstructSignature from "./rules/sort-construct-signature";
import sortExportSpecifiers from "./rules/sort-export-specifiers";
import sortKeys from "./rules/sort-keys";
import sortTopComments from "./rules/sort-top-comments";
import switchCaseSpacing from "./rules/switch-case-spacing";
import templateLiteralFormat from "./rules/template-literal-format";
import throwError from "./rules/throw-error";
import typescriptArrayCallbackReturnType from "./rules/typescript-array-callback-return-type";
import typescriptClassMethodsUseThis from "./rules/typescript-class-methods-use-this";
import typescriptConsistentArrayTypeName from "./rules/typescript-consistent-array-type-name";
import typescriptDefineFunctionInOneStatement from "./rules/typescript-define-function-in-one-statement";
import typescriptExhaustiveSwitch from "./rules/typescript-exhaustive-switch";
import typescriptNoBooleanLiteralType from "./rules/typescript-no-boolean-literal-type";
import typescriptNoComplexDeclaratorType from "./rules/typescript-no-complex-declarator-type";
import typescriptNoComplexReturnType from "./rules/typescript-no-complex-return-type";
import typescriptNoEmptyInterfaces from "./rules/typescript-no-empty-interfaces";
import typescriptNoInferrableTypes from "./rules/typescript-no-inferrable-types";
import typescriptNoMultiTypeTuples from "./rules/typescript-no-multi-type-tuples";
import typescriptNoNever from "./rules/typescript-no-never";
import typescriptNoRestrictedSyntax from "./rules/typescript-no-restricted-syntax";
import typescriptNoUnsafeObjectAssign from "./rules/typescript-no-unsafe-object-assign";
import typescriptNoUnsafeObjectAssignment from "./rules/typescript-no-unsafe-object-assignment";
import typescriptPreferArrayTypeAlias from "./rules/typescript-prefer-array-type-alias";
import typescriptPreferClassMethod from "./rules/typescript-prefer-class-method";
import typescriptPreferEnum from "./rules/typescript-prefer-enum";
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
    "comment-spacing": commentSpacing,
    "consistent-empty-lines": consistentEmptyLines,
    "consistent-enum-members": consistentEnumMembers,
    "consistent-filename": consistentFilename,
    "consistent-import": consistentImport,
    "consistent-optional-props": consistentOptionalProps,
    "consistent-source-extension": consistentSourceExtension,
    "consistent-symbol-description": consistentSymbolDescription,
    "disallow-import": disallowImport,
    "export-matching-filename-only": exportMatchingFilenameOnly,
    "match-filename": matchFilename,
    "max-identifier-blocks": maxIdentifierBlocks,
    "no-assign-mutated-array": noAssignMutatedArray,
    "no-at-sign-import": noAtSignImport,
    "no-at-sign-internal-import": noAtSignInternalImport,
    "no-chain-coalescence-mixture": noChainCoalescenceMixture,
    "no-commented-out-code": noCommentedOutCode,
    "no-const-enum": noConstEnum,
    "no-deprecated": noDeprecated,
    "no-enum": noEnum,
    "no-expression-empty-lines": noExpressionEmptyLines,
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
    "no-restricted-syntax": noRestrictedSyntax,
    "no-self-import": noSelfImport,
    "no-shadow": noShadow,
    "no-sibling-import": noSiblingImport,
    "no-t": noT,
    "no-underscore-export": noUnderscoreExport,
    "no-unnecessary-as-const": noUnnecessaryAsConst,
    "no-unnecessary-break": noUnnecessaryBreak,
    "no-unnecessary-initialization": noUnnecessaryInitialization,
    "no-unnecessary-template-literal": noUnnecessaryTemplateLiteral,
    "object-format": objectFormat,
    "only-export-name": onlyExportName,
    "prefer-arrow-function-property": preferArrowFunctionProperty,
    "prefer-const-require": preferConstRequire,
    "prefer-interface": preferInterface,
    "prefer-less-than": preferLessThan,
    "prefer-only-export": preferOnlyExport,
    "require-jsdoc": requireJSDoc,
    "require-syntax": requireSyntax,
    "restrict-identifier-characters": restrictIdentifierCharacters,
    "sort-array": sortArray,
    "sort-call-signature": sortCallSignature,
    "sort-class-members": sortClassMembers,
    "sort-construct-signature": sortConstructSignature,
    "sort-export-specifiers": sortExportSpecifiers,
    "sort-keys": sortKeys,
    "sort-top-comments": sortTopComments,
    "switch-case-spacing": switchCaseSpacing,
    "template-literal-format": templateLiteralFormat,
    "throw-error": throwError,
    "typescript/array-callback-return-type": typescriptArrayCallbackReturnType,
    "typescript/class-methods-use-this": typescriptClassMethodsUseThis,
    "typescript/consistent-array-type-name": typescriptConsistentArrayTypeName,
    "typescript/define-function-in-one-statement": typescriptDefineFunctionInOneStatement,
    "typescript/exhaustive-switch": typescriptExhaustiveSwitch,
    "typescript/no-boolean-literal-type": typescriptNoBooleanLiteralType,
    "typescript/no-complex-declarator-type": typescriptNoComplexDeclaratorType,
    "typescript/no-complex-return-type": typescriptNoComplexReturnType,
    "typescript/no-empty-interfaces": typescriptNoEmptyInterfaces,
    "typescript/no-inferrable-types": typescriptNoInferrableTypes,
    "typescript/no-multi-type-tuples": typescriptNoMultiTypeTuples,
    "typescript/no-never": typescriptNoNever,
    "typescript/no-restricted-syntax": typescriptNoRestrictedSyntax,
    "typescript/no-unsafe-object-assign": typescriptNoUnsafeObjectAssign,
    "typescript/no-unsafe-object-assignment": typescriptNoUnsafeObjectAssignment,
    "typescript/prefer-array-type-alias": typescriptPreferArrayTypeAlias,
    "typescript/prefer-class-method": typescriptPreferClassMethod,
    "typescript/prefer-enum": typescriptPreferEnum,
    "typescript/prefer-readonly-array": typescriptPreferReadonlyArray,
    "typescript/prefer-readonly-map": typescriptPreferReadonlyMap,
    "typescript/prefer-readonly-property": typescriptPreferReadonlyProperty,
    "typescript/prefer-readonly-set": typescriptPreferReadonlySet,
    "typescript/require-prop-type-annotation": typescriptRequirePropTypeAnnotation,
    "typescript/require-this-void": typescriptRequireThisVoid,
    "underscore-internal": underscoreInternal,
};

/* eslint-enable canonical/no-re-export -- Re-enable canonical re-export restriction outside this intentional map. */
