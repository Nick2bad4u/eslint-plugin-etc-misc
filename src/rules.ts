import type { TSESLint } from "@typescript-eslint/utils";
import type { UnknownArray } from "type-fest";

import { objectEntries, objectKeys, safeCastTo, setHas, objectFromEntries     } from "ts-extras";

import type { RuleCatalogEntry } from "./_internal/rule-catalog.js";

import { buildRuleCatalog } from "./_internal/rule-catalog.js";
import arrayType from "./rules/array-type.js";
import matchFilenameRule from "./rules/class-match-filename.js";
import commentSpacing from "./rules/comment-spacing.js";
import consistentEmptyLines from "./rules/consistent-empty-lines.js";
import consistentEnumMembers from "./rules/consistent-enum-members.js";
import consistentFilename from "./rules/consistent-filename.js";
import consistentImport from "./rules/consistent-import.js";
import consistentOptionalProps from "./rules/consistent-optional-props.js";
import consistentSourceExtension from "./rules/consistent-source-extension.js";
import consistentSymbolDescription from "./rules/consistent-symbol-description.js";
import defaultCase from "./rules/default-case.js";
import disallowImport from "./rules/disallow-import.js";
import exportMatchingFilenameOnly from "./rules/export-matching-filename-only.js";
import matchFilename from "./rules/match-filename.js";
import maxIdentifierBlocks from "./rules/max-identifier-blocks.js";
import noAssignMutatedArray from "./rules/no-assign-mutated-array.js";
import noAtSignImport from "./rules/no-at-sign-import.js";
import noAtSignInternalImport from "./rules/no-at-sign-internal-import.js";
import noChainCoalescenceMixture from "./rules/no-chain-coalescence-mixture.js";
import noCommentedOutCode from "./rules/no-commented-out-code.js";
import noConstEnum from "./rules/no-const-enum.js";
import noDeprecated from "./rules/no-deprecated.js";
import noEnum from "./rules/no-enum.js";
import noExpressionEmptyLines from "./rules/no-expression-empty-lines.js";
import noForeach from "./rules/no-foreach.js";
import noImplicitAnyCatch from "./rules/no-implicit-any-catch.js";
import noIndexImport from "./rules/no-index-import.js";
import noInternalModules from "./rules/no-internal-modules.js";
import noInternal from "./rules/no-internal.js";
import noLanguageMixing from "./rules/no-language-mixing.js";
import noMisusedGenerics from "./rules/no-misused-generics.js";
import noMixedEnums from "./rules/no-mixed-enums.js";
import noNegatedConditions from "./rules/no-negated-conditions.js";
import noNodejsModules from "./rules/no-nodejs-modules.js";
import noParamReassign from "./rules/no-param-reassign.js";
import noRelativeParentImport from "./rules/no-relative-parent-import.js";
import noRestrictedSyntax from "./rules/no-restricted-syntax.js";
import noSecret from "./rules/no-secret.js";
import noSelfImport from "./rules/no-self-import.js";
import noShadow from "./rules/no-shadow.js";
import noSiblingImport from "./rules/no-sibling-import.js";
import noSingleLineComment from "./rules/no-single-line-comment.js";
import noT from "./rules/no-t.js";
import noUnderscoreExport from "./rules/no-underscore-export.js";
import noUnnecessaryAsConst from "./rules/no-unnecessary-as-const.js";
import noUnnecessaryBreak from "./rules/no-unnecessary-break.js";
import noUnnecessaryInitialization from "./rules/no-unnecessary-initialization.js";
import noUnnecessaryTemplateLiteral from "./rules/no-unnecessary-template-literal.js";
import noUnusedDisable from "./rules/no-unused-disable.js";
import noUselessGenerics from "./rules/no-useless-generics.js";
import noValueToString from "./rules/no-value-tostring.js";
import noWriteonly from "./rules/no-writeonly.js";
import objectFormat from "./rules/object-format.js";
import onlyExportName from "./rules/only-export-name.js";
import preferArrowFunctionProperty from "./rules/prefer-arrow-function-property.js";
import preferConstRequire from "./rules/prefer-const-require.js";
import preferIncludes from "./rules/prefer-includes.js";
import preferInterface from "./rules/prefer-interface.js";
import preferLessThan from "./rules/prefer-less-than.js";
import preferObjectHasOwn from "./rules/prefer-object-has-own.js";
import preferOnlyExport from "./rules/prefer-only-export.js";
import requireJSDoc from "./rules/require-jsdoc.js";
import requireSyntax from "./rules/require-syntax.js";
import restrictIdentifierCharacters from "./rules/restrict-identifier-characters.js";
import sortArray from "./rules/sort-array.js";
import sortCallSignature from "./rules/sort-call-signature.js";
import sortClassMembers from "./rules/sort-class-members.js";
import sortConstructSignature from "./rules/sort-construct-signature.js";
import sortExportSpecifiers from "./rules/sort-export-specifiers.js";
import sortKeys from "./rules/sort-keys.js";
import sortTopComments from "./rules/sort-top-comments.js";
import switchCaseSpacing from "./rules/switch-case-spacing.js";
import templateLiteralFormat from "./rules/template-literal-format.js";
import throwError from "./rules/throw-error.js";
import throwNewError from "./rules/throw-new-error.js";
import typescriptArrayCallbackReturnType from "./rules/typescript-array-callback-return-type.js";
import typescriptClassMethodsUseThis from "./rules/typescript-class-methods-use-this.js";
import typescriptConsistentArrayTypeName from "./rules/typescript-consistent-array-type-name.js";
import typescriptDefineFunctionInOneStatement from "./rules/typescript-define-function-in-one-statement.js";
import typescriptExhaustiveSwitch from "./rules/typescript-exhaustive-switch.js";
import typescriptNoBooleanLiteralType from "./rules/typescript-no-boolean-literal-type.js";
import typescriptNoComplexDeclaratorType from "./rules/typescript-no-complex-declarator-type.js";
import typescriptNoComplexReturnType from "./rules/typescript-no-complex-return-type.js";
import typescriptNoEmptyInterfaces from "./rules/typescript-no-empty-interfaces.js";
import typescriptNoInferrableTypes from "./rules/typescript-no-inferrable-types.js";
import typescriptNoMultiTypeTuples from "./rules/typescript-no-multi-type-tuples.js";
import typescriptNoNever from "./rules/typescript-no-never.js";
import typescriptNoRedundantUndefinedConst from "./rules/typescript-no-redundant-undefined-const.js";
import typescriptNoRedundantUndefinedDefaultParameter from "./rules/typescript-no-redundant-undefined-default-parameter.js";
import typescriptNoRedundantUndefinedLet from "./rules/typescript-no-redundant-undefined-let.js";
import typescriptNoRedundantUndefinedOptional from "./rules/typescript-no-redundant-undefined-optional.js";
import typescriptNoRedundantUndefinedPromiseReturnType from "./rules/typescript-no-redundant-undefined-promise-return-type.js";
import typescriptNoRedundantUndefinedReadonlyProperty from "./rules/typescript-no-redundant-undefined-readonly-property.js";
import typescriptNoRedundantUndefinedReturnType from "./rules/typescript-no-redundant-undefined-return-type.js";
import typescriptNoRedundantUndefinedVar from "./rules/typescript-no-redundant-undefined-var.js";
import typescriptNoRestrictedSyntax from "./rules/typescript-no-restricted-syntax.js";
import typescriptNoUnsafeObjectAssign from "./rules/typescript-no-unsafe-object-assign.js";
import typescriptNoUnsafeObjectAssignment from "./rules/typescript-no-unsafe-object-assignment.js";
import typescriptPreferArrayTypeAlias from "./rules/typescript-prefer-array-type-alias.js";
import typescriptPreferClassMethod from "./rules/typescript-prefer-class-method.js";
import typescriptPreferEnum from "./rules/typescript-prefer-enum.js";
import typescriptPreferNamedTupleMembers from "./rules/typescript-prefer-named-tuple-members.js";
import typescriptPreferReadonlyArrayParameter from "./rules/typescript-prefer-readonly-array-parameter.js";
import typescriptPreferReadonlyArray from "./rules/typescript-prefer-readonly-array.js";
import typescriptPreferReadonlyIndexSignature from "./rules/typescript-prefer-readonly-index-signature.js";
import typescriptPreferReadonlyMap from "./rules/typescript-prefer-readonly-map.js";
import typescriptPreferReadonlyProperty from "./rules/typescript-prefer-readonly-property.js";
import typescriptPreferReadonlyRecord from "./rules/typescript-prefer-readonly-record.js";
import typescriptPreferReadonlySet from "./rules/typescript-prefer-readonly-set.js";
import typescriptRequirePropTypeAnnotation from "./rules/typescript-require-prop-type-annotation.js";
import typescriptRequireReadonlyArrayPropertyType from "./rules/typescript-require-readonly-array-property-type.js";
import typescriptRequireReadonlyArrayReturnType from "./rules/typescript-require-readonly-array-return-type.js";
import typescriptRequireReadonlyArrayTypeAlias from "./rules/typescript-require-readonly-array-type-alias.js";
import typescriptRequireReadonlyMapParameterType from "./rules/typescript-require-readonly-map-parameter-type.js";
import typescriptRequireReadonlyMapPropertyType from "./rules/typescript-require-readonly-map-property-type.js";
import typescriptRequireReadonlyMapReturnType from "./rules/typescript-require-readonly-map-return-type.js";
import typescriptRequireReadonlyMapTypeAlias from "./rules/typescript-require-readonly-map-type-alias.js";
import typescriptRequireReadonlyRecordParameterType from "./rules/typescript-require-readonly-record-parameter-type.js";
import typescriptRequireReadonlyRecordPropertyType from "./rules/typescript-require-readonly-record-property-type.js";
import typescriptRequireReadonlyRecordReturnType from "./rules/typescript-require-readonly-record-return-type.js";
import typescriptRequireReadonlyRecordTypeAlias from "./rules/typescript-require-readonly-record-type-alias.js";
import typescriptRequireReadonlySetParameterType from "./rules/typescript-require-readonly-set-parameter-type.js";
import typescriptRequireReadonlySetPropertyType from "./rules/typescript-require-readonly-set-property-type.js";
import typescriptRequireReadonlySetReturnType from "./rules/typescript-require-readonly-set-return-type.js";
import typescriptRequireReadonlySetTypeAlias from "./rules/typescript-require-readonly-set-type-alias.js";
import typescriptRequireThisVoid from "./rules/typescript-require-this-void.js";
import underscoreInternal from "./rules/underscore-internal.js";
import unusedInternalProperties from "./rules/unused-internal-properties.js";
import uppercaseIife from "./rules/uppercase-iife.js";
import words from "./rules/words.js";

type RuleDocsMetadata = {
    readonly catalogId?: string;
    readonly catalogIndex?: number;
    readonly deprecated?: boolean;
    readonly description?: string;
    readonly frozen?: boolean;
    readonly recommended?: boolean;
    readonly requiresTypeChecking?: boolean;
    readonly ruleName?: string;
    readonly suggestion?: boolean;
    readonly url?: string;
};

type RuleModule = TSESLint.RuleModule<string, Readonly<UnknownArray>>;

const rulesWithRequiredTypeChecking = new Set<string>([
    "no-assign-mutated-array",
    "no-deprecated",
    "no-foreach",
    "no-implicit-any-catch",
    "no-internal",
    "no-misused-generics",
    "throw-error",
    "typescript/array-callback-return-type",
    "typescript/no-never",
    "typescript/no-unsafe-object-assign",
    "typescript/prefer-enum",
]);

const recommendedRuleNames = new Set<string>([
    "consistent-optional-props",
    "no-assign-mutated-array",
    "no-const-enum",
    "no-implicit-any-catch",
    "no-internal",
    "no-t",
    "no-unnecessary-as-const",
    "no-unnecessary-break",
    "no-unnecessary-initialization",
    "no-unnecessary-template-literal",
    "throw-error",
    "typescript/no-boolean-literal-type",
    "typescript/prefer-readonly-array",
    "typescript/prefer-readonly-array-parameter",
    "typescript/prefer-readonly-index-signature",
    "typescript/prefer-readonly-map",
    "typescript/prefer-readonly-property",
    "typescript/prefer-readonly-record",
    "typescript/prefer-readonly-set",
    "typescript/require-readonly-array-return-type",
    "typescript/require-this-void",
]);

/**
 * Rule implementations keyed by rule name.
 */
const baseRules: Readonly<Record<string, RuleModule>> = {
    "array-type": arrayType,
    "class-match-filename": matchFilenameRule,
    "comment-spacing": commentSpacing,
    "consistent-empty-lines": consistentEmptyLines,
    "consistent-enum-members": consistentEnumMembers,
    "consistent-filename": consistentFilename,
    "consistent-import": consistentImport,
    "consistent-optional-props": consistentOptionalProps,
    "consistent-source-extension": consistentSourceExtension,
    "consistent-symbol-description": consistentSymbolDescription,
    "default-case": defaultCase,
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
    "no-mixed-enums": noMixedEnums,
    "no-negated-conditions": noNegatedConditions,
    "no-nodejs-modules": noNodejsModules,
    "no-param-reassign": noParamReassign,
    "no-relative-parent-import": noRelativeParentImport,
    "no-restricted-syntax": noRestrictedSyntax,
    "no-secret": noSecret,
    "no-self-import": noSelfImport,
    "no-shadow": noShadow,
    "no-sibling-import": noSiblingImport,
    "no-single-line-comment": noSingleLineComment,
    "no-t": noT,
    "no-underscore-export": noUnderscoreExport,
    "no-unnecessary-as-const": noUnnecessaryAsConst,
    "no-unnecessary-break": noUnnecessaryBreak,
    "no-unnecessary-initialization": noUnnecessaryInitialization,
    "no-unnecessary-template-literal": noUnnecessaryTemplateLiteral,
    "no-unused-disable": noUnusedDisable,
    "no-useless-generics": noUselessGenerics,
    "no-value-tostring": noValueToString,
    "no-writeonly": noWriteonly,
    "object-format": objectFormat,
    "only-export-name": onlyExportName,
    "prefer-arrow-function-property": preferArrowFunctionProperty,
    "prefer-const-require": preferConstRequire,
    "prefer-includes": preferIncludes,
    "prefer-interface": preferInterface,
    "prefer-less-than": preferLessThan,
    "prefer-object-has-own": preferObjectHasOwn,
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
    "throw-new-error": throwNewError,
    "typescript/array-callback-return-type": typescriptArrayCallbackReturnType,
    "typescript/class-methods-use-this": typescriptClassMethodsUseThis,
    "typescript/consistent-array-type-name": typescriptConsistentArrayTypeName,
    "typescript/define-function-in-one-statement":
        typescriptDefineFunctionInOneStatement,
    "typescript/exhaustive-switch": typescriptExhaustiveSwitch,
    "typescript/no-boolean-literal-type": typescriptNoBooleanLiteralType,
    "typescript/no-complex-declarator-type": typescriptNoComplexDeclaratorType,
    "typescript/no-complex-return-type": typescriptNoComplexReturnType,
    "typescript/no-empty-interfaces": typescriptNoEmptyInterfaces,
    "typescript/no-inferrable-types": typescriptNoInferrableTypes,
    "typescript/no-multi-type-tuples": typescriptNoMultiTypeTuples,
    "typescript/no-never": typescriptNoNever,
    "typescript/no-redundant-undefined-const":
        typescriptNoRedundantUndefinedConst,
    "typescript/no-redundant-undefined-default-parameter":
        typescriptNoRedundantUndefinedDefaultParameter,
    "typescript/no-redundant-undefined-let": typescriptNoRedundantUndefinedLet,
    "typescript/no-redundant-undefined-optional":
        typescriptNoRedundantUndefinedOptional,
    "typescript/no-redundant-undefined-promise-return-type":
        typescriptNoRedundantUndefinedPromiseReturnType,
    "typescript/no-redundant-undefined-readonly-property":
        typescriptNoRedundantUndefinedReadonlyProperty,
    "typescript/no-redundant-undefined-return-type":
        typescriptNoRedundantUndefinedReturnType,
    "typescript/no-redundant-undefined-var": typescriptNoRedundantUndefinedVar,
    "typescript/no-restricted-syntax": typescriptNoRestrictedSyntax,
    "typescript/no-unsafe-object-assign": typescriptNoUnsafeObjectAssign,
    "typescript/no-unsafe-object-assignment":
        typescriptNoUnsafeObjectAssignment,
    "typescript/prefer-array-type-alias": typescriptPreferArrayTypeAlias,
    "typescript/prefer-class-method": typescriptPreferClassMethod,
    "typescript/prefer-enum": typescriptPreferEnum,
    "typescript/prefer-named-tuple-members": typescriptPreferNamedTupleMembers,
    "typescript/prefer-readonly-array": typescriptPreferReadonlyArray,
    "typescript/prefer-readonly-array-parameter":
        typescriptPreferReadonlyArrayParameter,
    "typescript/prefer-readonly-index-signature":
        typescriptPreferReadonlyIndexSignature,
    "typescript/prefer-readonly-map": typescriptPreferReadonlyMap,
    "typescript/prefer-readonly-property": typescriptPreferReadonlyProperty,
    "typescript/prefer-readonly-record": typescriptPreferReadonlyRecord,
    "typescript/prefer-readonly-set": typescriptPreferReadonlySet,
    "typescript/require-prop-type-annotation":
        typescriptRequirePropTypeAnnotation,
    "typescript/require-readonly-array-property-type":
        typescriptRequireReadonlyArrayPropertyType,
    "typescript/require-readonly-array-return-type":
        typescriptRequireReadonlyArrayReturnType,
    "typescript/require-readonly-array-type-alias":
        typescriptRequireReadonlyArrayTypeAlias,
    "typescript/require-readonly-map-parameter-type":
        typescriptRequireReadonlyMapParameterType,
    "typescript/require-readonly-map-property-type":
        typescriptRequireReadonlyMapPropertyType,
    "typescript/require-readonly-map-return-type":
        typescriptRequireReadonlyMapReturnType,
    "typescript/require-readonly-map-type-alias":
        typescriptRequireReadonlyMapTypeAlias,
    "typescript/require-readonly-record-parameter-type":
        typescriptRequireReadonlyRecordParameterType,
    "typescript/require-readonly-record-property-type":
        typescriptRequireReadonlyRecordPropertyType,
    "typescript/require-readonly-record-return-type":
        typescriptRequireReadonlyRecordReturnType,
    "typescript/require-readonly-record-type-alias":
        typescriptRequireReadonlyRecordTypeAlias,
    "typescript/require-readonly-set-parameter-type":
        typescriptRequireReadonlySetParameterType,
    "typescript/require-readonly-set-property-type":
        typescriptRequireReadonlySetPropertyType,
    "typescript/require-readonly-set-return-type":
        typescriptRequireReadonlySetReturnType,
    "typescript/require-readonly-set-type-alias":
        typescriptRequireReadonlySetTypeAlias,
    "typescript/require-this-void": typescriptRequireThisVoid,
    "underscore-internal": underscoreInternal,
    "unused-internal-properties": unusedInternalProperties,
    "uppercase-iife": uppercaseIife,
    words: words,
};

const ruleCatalog = buildRuleCatalog(objectKeys(baseRules));

/**
 * Globally ordered catalog entries for every rule.
 */
export const ruleCatalogEntries: readonly RuleCatalogEntry[] =
    ruleCatalog.ordered;

/**
 * Catalog metadata keyed by rule name.
 */
export const ruleCatalogByRuleName: Readonly<Record<string, RuleCatalogEntry>> =
    ruleCatalog.byRuleName;

/**
 * Catalog metadata keyed by documentation id (`/` replaced with `-`).
 */
export const ruleCatalogByDocId: Readonly<Record<string, RuleCatalogEntry>> =
    ruleCatalog.byDocId;

const withCatalogDocsMetadata = (
    ruleName: string,
    ruleModule: Readonly<RuleModule>
): RuleModule => {
    const catalogEntry = ruleCatalog.byRuleName[ruleName];

    if (!catalogEntry) {
        throw new Error(`Missing rule catalog entry for rule "${ruleName}".`);
    }

    const currentDocsMetadata = safeCastTo<RuleDocsMetadata>(ruleModule.meta.docs ??
        {});
    const hasRequiredTypeChecking = setHas(rulesWithRequiredTypeChecking, ruleName);
    const deprecatedMetadata =
        ruleModule.meta.deprecated === undefined
            ? false
            : ruleModule.meta.deprecated;
    const isDeprecatedRule = deprecatedMetadata !== false;
    const docsWithCatalogMetadata = {
        ...currentDocsMetadata,
        catalogId: catalogEntry.catalogId,
        catalogIndex: catalogEntry.catalogIndex,
        deprecated: currentDocsMetadata.deprecated ?? isDeprecatedRule,
        frozen:
            currentDocsMetadata.frozen ??
            currentDocsMetadata.deprecated ??
            isDeprecatedRule,
        recommended: setHas(recommendedRuleNames, ruleName),
        requiresTypeChecking:
            currentDocsMetadata.requiresTypeChecking ?? hasRequiredTypeChecking,
        ruleName,
    } as NonNullable<RuleModule["meta"]["docs"]>;

    return {
        ...ruleModule,
        meta: {
            ...ruleModule.meta,
            deprecated: deprecatedMetadata,
            docs: docsWithCatalogMetadata,
        },
    };
};

const decoratedRuleEntries = objectEntries(baseRules).map(
    ([ruleName, ruleModule]) =>
        [ruleName, withCatalogDocsMetadata(ruleName, ruleModule)] as const
);

const decoratedRules = safeCastTo<Readonly<
    Record<string, RuleModule>
>>(objectFromEntries(decoratedRuleEntries));

/**
 * Rule implementations keyed by rule name with normalized docs metadata.
 */
export const rules: Readonly<Record<string, RuleModule>> =
    Object.freeze(decoratedRules);
