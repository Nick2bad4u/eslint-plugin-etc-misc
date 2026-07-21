import type { TSESLint } from "@typescript-eslint/utils";
import type { UnknownArray } from "type-fest";

import { assertDefined, objectEntries, objectKeys, setHas } from "ts-extras";

import type { RuleDocsMetadata } from "./_internal/rule-creator.js";

import { buildRuleCatalog } from "./_internal/rule-catalog.js";
import * as matchFilenameRuleModule from "./rules/class-match-filename.js";
import * as commentSpacingModule from "./rules/comment-spacing.js";
import * as consistentEmptyLinesModule from "./rules/consistent-empty-lines.js";
import * as consistentEnumMembersModule from "./rules/consistent-enum-members.js";
import * as consistentFilenameModule from "./rules/consistent-filename.js";
import * as consistentImportModule from "./rules/consistent-import.js";
import * as consistentOptionalPropsModule from "./rules/consistent-optional-props.js";
import * as consistentSourceExtensionModule from "./rules/consistent-source-extension.js";
import * as consistentSymbolDescriptionModule from "./rules/consistent-symbol-description.js";
import * as decoratorPositionModule from "./rules/decorator-position.js";
import * as defaultCaseModule from "./rules/default-case.js";
import * as disallowImportModule from "./rules/disallow-import.js";
import * as exportMatchingFilenameOnlyModule from "./rules/export-matching-filename-only.js";
import * as jsxNoJsxAsPropModule from "./rules/jsx-no-jsx-as-prop.js";
import * as jsxNoNewArrayAsPropModule from "./rules/jsx-no-new-array-as-prop.js";
import * as jsxNoNewFunctionAsPropModule from "./rules/jsx-no-new-function-as-prop.js";
import * as jsxNoNewObjectAsPropModule from "./rules/jsx-no-new-object-as-prop.js";
import * as matchFilenameModule from "./rules/match-filename.js";
import * as maxIdentifierBlocksModule from "./rules/max-identifier-blocks.js";
import * as noAssignMutatedArrayModule from "./rules/no-assign-mutated-array.js";
import * as noAtSignImportModule from "./rules/no-at-sign-import.js";
import * as noAtSignInternalImportModule from "./rules/no-at-sign-internal-import.js";
import * as noChainCoalescenceMixtureModule from "./rules/no-chain-coalescence-mixture.js";
import * as noCommentedOutCodeModule from "./rules/no-commented-out-code.js";
import * as noConstEnumModule from "./rules/no-const-enum.js";
import * as noConstructorBindModule from "./rules/no-constructor-bind.js";
import * as noConstructorStateModule from "./rules/no-constructor-state.js";
import * as noDeprecatedModule from "./rules/no-deprecated.js";
import * as noDomGlobalsInConstructorModule from "./rules/no-dom-globals-in-constructor.js";
import * as noDomGlobalsInModuleScopeModule from "./rules/no-dom-globals-in-module-scope.js";
import * as noDomGlobalsInReactCcRenderModule from "./rules/no-dom-globals-in-react-cc-render.js";
import * as noDomGlobalsInReactFcModule from "./rules/no-dom-globals-in-react-fc.js";
import * as noEnumModule from "./rules/no-enum.js";
import * as noExpressionEmptyLinesModule from "./rules/no-expression-empty-lines.js";
import * as noForeachModule from "./rules/no-foreach.js";
import * as noFunctionDeclareAfterReturnModule from "./rules/no-function-declare-after-return.js";
import * as noImplicitAnyCatchModule from "./rules/no-implicit-any-catch.js";
import * as noIndexImportModule from "./rules/no-index-import.js";
import * as noInternalModulesModule from "./rules/no-internal-modules.js";
import * as noInternalModule from "./rules/no-internal.js";
import * as noInvalidJsxNestingModule from "./rules/no-invalid-jsx-nesting.js";
import * as noLanguageMixingModule from "./rules/no-language-mixing.js";
import * as noMisusedGenericsModule from "./rules/no-misused-generics.js";
import * as noNegatedConditionsModule from "./rules/no-negated-conditions.js";
import * as noNodejsModulesModule from "./rules/no-nodejs-modules.js";
import * as noOnlyTestsModule from "./rules/no-only-tests.js";
import * as noParamReassignModule from "./rules/no-param-reassign.js";
import * as noRelativeParentImportModule from "./rules/no-relative-parent-import.js";
import * as noRestrictedSyntaxModule from "./rules/no-restricted-syntax.js";
import * as noSelfImportModule from "./rules/no-self-import.js";
import * as noShadowModule from "./rules/no-shadow.js";
import * as noSiblingImportModule from "./rules/no-sibling-import.js";
import * as noSingleLineCommentModule from "./rules/no-single-line-comment.js";
import * as noTModule from "./rules/no-t.js";
import * as noUnderscoreExportModule from "./rules/no-underscore-export.js";
import * as noUnnecessaryAsConstModule from "./rules/no-unnecessary-as-const.js";
import * as noUnnecessaryBreakModule from "./rules/no-unnecessary-break.js";
import * as noUnnecessaryInitializationModule from "./rules/no-unnecessary-initialization.js";
import * as noUnnecessaryTemplateLiteralModule from "./rules/no-unnecessary-template-literal.js";
import * as noUnstableReactChildrenModule from "./rules/no-unstable-react-children.js";
import * as noUnstableReactValuesModule from "./rules/no-unstable-react-values.js";
import * as noUseExtendNativeModule from "./rules/no-use-extend-native.js";
import * as noVulnerableModule from "./rules/no-vulnerable.js";
import * as noWriteonlyModule from "./rules/no-writeonly.js";
import * as objectFormatModule from "./rules/object-format.js";
import * as onlyExportNameModule from "./rules/only-export-name.js";
import * as preferArrowFunctionPropertyModule from "./rules/prefer-arrow-function-property.js";
import * as preferConstRequireModule from "./rules/prefer-const-require.js";
import * as preferInterfaceModule from "./rules/prefer-interface.js";
import * as preferLessThanModule from "./rules/prefer-less-than.js";
import * as preferObjectHasOwnModule from "./rules/prefer-object-has-own.js";
import * as preferOnlyExportModule from "./rules/prefer-only-export.js";
import * as reactPreferFunctionComponentModule from "./rules/react-prefer-function-component.js";
import * as requireJSDocModule from "./rules/require-jsdoc.js";
import * as requireMemoModule from "./rules/require-memo.js";
import * as requireSyntaxModule from "./rules/require-syntax.js";
import * as requireUsememoChildrenModule from "./rules/require-usememo-children.js";
import * as requireUsememoModule from "./rules/require-usememo.js";
import * as restrictIdentifierCharactersModule from "./rules/restrict-identifier-characters.js";
import * as sortArrayModule from "./rules/sort-array.js";
import * as sortCallSignatureModule from "./rules/sort-call-signature.js";
import * as sortClassMembersModule from "./rules/sort-class-members.js";
import * as sortConstructSignatureModule from "./rules/sort-construct-signature.js";
import * as sortExportSpecifiersModule from "./rules/sort-export-specifiers.js";
import * as sortKeysModule from "./rules/sort-keys.js";
import * as sortTopCommentsModule from "./rules/sort-top-comments.js";
import * as switchCaseSpacingModule from "./rules/switch-case-spacing.js";
import * as templateLiteralFormatModule from "./rules/template-literal-format.js";
import * as throwErrorModule from "./rules/throw-error.js";
import * as typescriptArrayCallbackReturnTypeModule from "./rules/typescript-array-callback-return-type.js";
import * as typescriptClassMethodsUseThisModule from "./rules/typescript-class-methods-use-this.js";
import * as typescriptConsistentArrayTypeNameModule from "./rules/typescript-consistent-array-type-name.js";
import * as typescriptDefineFunctionInOneStatementModule from "./rules/typescript-define-function-in-one-statement.js";
import * as typescriptExhaustiveSwitchModule from "./rules/typescript-exhaustive-switch.js";
import * as typescriptNoBooleanLiteralTypeModule from "./rules/typescript-no-boolean-literal-type.js";
import * as typescriptNoComplexDeclaratorTypeModule from "./rules/typescript-no-complex-declarator-type.js";
import * as typescriptNoComplexReturnTypeModule from "./rules/typescript-no-complex-return-type.js";
import * as typescriptNoEmptyInterfacesModule from "./rules/typescript-no-empty-interfaces.js";
import * as typescriptNoInferrableTypesModule from "./rules/typescript-no-inferrable-types.js";
import * as typescriptNoMultiTypeTuplesModule from "./rules/typescript-no-multi-type-tuples.js";
import * as typescriptNoNeverModule from "./rules/typescript-no-never.js";
import * as typescriptNoRedundantUndefinedConstModule from "./rules/typescript-no-redundant-undefined-const.js";
import * as typescriptNoRedundantUndefinedDefaultParameterModule from "./rules/typescript-no-redundant-undefined-default-parameter.js";
import * as typescriptNoRedundantUndefinedLetModule from "./rules/typescript-no-redundant-undefined-let.js";
import * as typescriptNoRedundantUndefinedOptionalModule from "./rules/typescript-no-redundant-undefined-optional.js";
import * as typescriptNoRedundantUndefinedPromiseReturnTypeModule from "./rules/typescript-no-redundant-undefined-promise-return-type.js";
import * as typescriptNoRedundantUndefinedReadonlyPropertyModule from "./rules/typescript-no-redundant-undefined-readonly-property.js";
import * as typescriptNoRedundantUndefinedReturnTypeModule from "./rules/typescript-no-redundant-undefined-return-type.js";
import * as typescriptNoRedundantUndefinedVarModule from "./rules/typescript-no-redundant-undefined-var.js";
import * as typescriptNoRestrictedSyntaxModule from "./rules/typescript-no-restricted-syntax.js";
import * as typescriptNoUnsafeObjectAssignModule from "./rules/typescript-no-unsafe-object-assign.js";
import * as typescriptNoUnsafeObjectAssignmentModule from "./rules/typescript-no-unsafe-object-assignment.js";
import * as typescriptPreferArrayTypeAliasModule from "./rules/typescript-prefer-array-type-alias.js";
import * as typescriptPreferClassMethodModule from "./rules/typescript-prefer-class-method.js";
import * as typescriptPreferEnumModule from "./rules/typescript-prefer-enum.js";
import * as typescriptPreferNamedTupleMembersModule from "./rules/typescript-prefer-named-tuple-members.js";
import * as typescriptPreferReadonlyArrayParameterModule from "./rules/typescript-prefer-readonly-array-parameter.js";
import * as typescriptPreferReadonlyArrayModule from "./rules/typescript-prefer-readonly-array.js";
import * as typescriptPreferReadonlyIndexSignatureModule from "./rules/typescript-prefer-readonly-index-signature.js";
import * as typescriptPreferReadonlyMapModule from "./rules/typescript-prefer-readonly-map.js";
import * as typescriptPreferReadonlyPropertyModule from "./rules/typescript-prefer-readonly-property.js";
import * as typescriptPreferReadonlyRecordModule from "./rules/typescript-prefer-readonly-record.js";
import * as typescriptPreferReadonlySetModule from "./rules/typescript-prefer-readonly-set.js";
import * as typescriptRequirePropTypeAnnotationModule from "./rules/typescript-require-prop-type-annotation.js";
import * as typescriptRequireReadonlyArrayPropertyTypeModule from "./rules/typescript-require-readonly-array-property-type.js";
import * as typescriptRequireReadonlyArrayReturnTypeModule from "./rules/typescript-require-readonly-array-return-type.js";
import * as typescriptRequireReadonlyArrayTypeAliasModule from "./rules/typescript-require-readonly-array-type-alias.js";
import * as typescriptRequireReadonlyMapParameterTypeModule from "./rules/typescript-require-readonly-map-parameter-type.js";
import * as typescriptRequireReadonlyMapPropertyTypeModule from "./rules/typescript-require-readonly-map-property-type.js";
import * as typescriptRequireReadonlyMapReturnTypeModule from "./rules/typescript-require-readonly-map-return-type.js";
import * as typescriptRequireReadonlyMapTypeAliasModule from "./rules/typescript-require-readonly-map-type-alias.js";
import * as typescriptRequireReadonlyRecordParameterTypeModule from "./rules/typescript-require-readonly-record-parameter-type.js";
import * as typescriptRequireReadonlyRecordPropertyTypeModule from "./rules/typescript-require-readonly-record-property-type.js";
import * as typescriptRequireReadonlyRecordReturnTypeModule from "./rules/typescript-require-readonly-record-return-type.js";
import * as typescriptRequireReadonlyRecordTypeAliasModule from "./rules/typescript-require-readonly-record-type-alias.js";
import * as typescriptRequireReadonlySetParameterTypeModule from "./rules/typescript-require-readonly-set-parameter-type.js";
import * as typescriptRequireReadonlySetPropertyTypeModule from "./rules/typescript-require-readonly-set-property-type.js";
import * as typescriptRequireReadonlySetReturnTypeModule from "./rules/typescript-require-readonly-set-return-type.js";
import * as typescriptRequireReadonlySetTypeAliasModule from "./rules/typescript-require-readonly-set-type-alias.js";
import * as typescriptRequireThisVoidModule from "./rules/typescript-require-this-void.js";
import * as underscoreInternalModule from "./rules/underscore-internal.js";

type BaseRuleModule = TSESLint.RuleModule<
    string,
    Readonly<UnknownArray>,
    RuleDocsMetadata
>;

type RuleModule = BaseRuleModule &
    Readonly<{
        readonly meta: BaseRuleModule["meta"] &
            Readonly<{ readonly languages: readonly ["js/js"] }>;
    }>;

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
    "no-function-declare-after-return",
    "no-implicit-any-catch",
    "no-internal",
    "no-t",
    "no-unnecessary-as-const",
    "no-unnecessary-break",
    "no-unnecessary-initialization",
    "no-unnecessary-template-literal",
    "no-vulnerable",
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
const baseRules: Readonly<Record<string, BaseRuleModule>> = {
    "class-match-filename": matchFilenameRuleModule.default,
    "comment-spacing": commentSpacingModule.default,
    "consistent-empty-lines": consistentEmptyLinesModule.default,
    "consistent-enum-members": consistentEnumMembersModule.default,
    "consistent-filename": consistentFilenameModule.default,
    "consistent-import": consistentImportModule.default,
    "consistent-optional-props": consistentOptionalPropsModule.default,
    "consistent-source-extension": consistentSourceExtensionModule.default,
    "consistent-symbol-description": consistentSymbolDescriptionModule.default,
    "decorator-position": decoratorPositionModule.default,
    "default-case": defaultCaseModule.default,
    "disallow-import": disallowImportModule.default,
    "export-matching-filename-only": exportMatchingFilenameOnlyModule.default,
    "jsx-no-jsx-as-prop": jsxNoJsxAsPropModule.default,
    "jsx-no-new-array-as-prop": jsxNoNewArrayAsPropModule.default,
    "jsx-no-new-function-as-prop": jsxNoNewFunctionAsPropModule.default,
    "jsx-no-new-object-as-prop": jsxNoNewObjectAsPropModule.default,
    "match-filename": matchFilenameModule.default,
    "max-identifier-blocks": maxIdentifierBlocksModule.default,
    "no-assign-mutated-array": noAssignMutatedArrayModule.default,
    "no-at-sign-import": noAtSignImportModule.default,
    "no-at-sign-internal-import": noAtSignInternalImportModule.default,
    "no-chain-coalescence-mixture": noChainCoalescenceMixtureModule.default,
    "no-commented-out-code": noCommentedOutCodeModule.default,
    "no-const-enum": noConstEnumModule.default,
    "no-constructor-bind": noConstructorBindModule.default,
    "no-constructor-state": noConstructorStateModule.default,
    "no-deprecated": noDeprecatedModule.default,
    "no-dom-globals-in-constructor": noDomGlobalsInConstructorModule.default,
    "no-dom-globals-in-module-scope": noDomGlobalsInModuleScopeModule.default,
    "no-dom-globals-in-react-cc-render":
        noDomGlobalsInReactCcRenderModule.default,
    "no-dom-globals-in-react-fc": noDomGlobalsInReactFcModule.default,
    "no-enum": noEnumModule.default,
    "no-expression-empty-lines": noExpressionEmptyLinesModule.default,
    "no-foreach": noForeachModule.default,
    "no-function-declare-after-return":
        noFunctionDeclareAfterReturnModule.default,
    "no-implicit-any-catch": noImplicitAnyCatchModule.default,
    "no-index-import": noIndexImportModule.default,
    "no-internal": noInternalModule.default,
    "no-internal-modules": noInternalModulesModule.default,
    "no-invalid-jsx-nesting": noInvalidJsxNestingModule.default,
    "no-language-mixing": noLanguageMixingModule.default,
    "no-misused-generics": noMisusedGenericsModule.default,
    "no-negated-conditions": noNegatedConditionsModule.default,
    "no-nodejs-modules": noNodejsModulesModule.default,
    "no-only-tests": noOnlyTestsModule.default,
    "no-param-reassign": noParamReassignModule.default,
    "no-relative-parent-import": noRelativeParentImportModule.default,
    "no-restricted-syntax": noRestrictedSyntaxModule.default,
    "no-self-import": noSelfImportModule.default,
    "no-shadow": noShadowModule.default,
    "no-sibling-import": noSiblingImportModule.default,
    "no-single-line-comment": noSingleLineCommentModule.default,
    "no-t": noTModule.default,
    "no-underscore-export": noUnderscoreExportModule.default,
    "no-unnecessary-as-const": noUnnecessaryAsConstModule.default,
    "no-unnecessary-break": noUnnecessaryBreakModule.default,
    "no-unnecessary-initialization": noUnnecessaryInitializationModule.default,
    "no-unnecessary-template-literal":
        noUnnecessaryTemplateLiteralModule.default,
    "no-unstable-react-children": noUnstableReactChildrenModule.default,
    "no-unstable-react-values": noUnstableReactValuesModule.default,
    "no-use-extend-native": noUseExtendNativeModule.default,
    "no-vulnerable": noVulnerableModule.default,
    "no-writeonly": noWriteonlyModule.default,
    "object-format": objectFormatModule.default,
    "only-export-name": onlyExportNameModule.default,
    "prefer-arrow-function-property": preferArrowFunctionPropertyModule.default,
    "prefer-const-require": preferConstRequireModule.default,
    "prefer-interface": preferInterfaceModule.default,
    "prefer-less-than": preferLessThanModule.default,
    "prefer-object-has-own": preferObjectHasOwnModule.default,
    "prefer-only-export": preferOnlyExportModule.default,
    "react-prefer-function-component":
        reactPreferFunctionComponentModule.default,
    "require-jsdoc": requireJSDocModule.default,
    "require-memo": requireMemoModule.default,
    "require-syntax": requireSyntaxModule.default,
    "require-usememo": requireUsememoModule.default,
    "require-usememo-children": requireUsememoChildrenModule.default,
    "restrict-identifier-characters":
        restrictIdentifierCharactersModule.default,
    "sort-array": sortArrayModule.default,
    "sort-call-signature": sortCallSignatureModule.default,
    "sort-class-members": sortClassMembersModule.default,
    "sort-construct-signature": sortConstructSignatureModule.default,
    "sort-export-specifiers": sortExportSpecifiersModule.default,
    "sort-keys": sortKeysModule.default,
    "sort-top-comments": sortTopCommentsModule.default,
    "switch-case-spacing": switchCaseSpacingModule.default,
    "template-literal-format": templateLiteralFormatModule.default,
    "throw-error": throwErrorModule.default,
    "typescript/array-callback-return-type":
        typescriptArrayCallbackReturnTypeModule.default,
    "typescript/class-methods-use-this":
        typescriptClassMethodsUseThisModule.default,
    "typescript/consistent-array-type-name":
        typescriptConsistentArrayTypeNameModule.default,
    "typescript/define-function-in-one-statement":
        typescriptDefineFunctionInOneStatementModule.default,
    "typescript/exhaustive-switch": typescriptExhaustiveSwitchModule.default,
    "typescript/no-boolean-literal-type":
        typescriptNoBooleanLiteralTypeModule.default,
    "typescript/no-complex-declarator-type":
        typescriptNoComplexDeclaratorTypeModule.default,
    "typescript/no-complex-return-type":
        typescriptNoComplexReturnTypeModule.default,
    "typescript/no-empty-interfaces": typescriptNoEmptyInterfacesModule.default,
    "typescript/no-inferrable-types": typescriptNoInferrableTypesModule.default,
    "typescript/no-multi-type-tuples":
        typescriptNoMultiTypeTuplesModule.default,
    "typescript/no-never": typescriptNoNeverModule.default,
    "typescript/no-redundant-undefined-const":
        typescriptNoRedundantUndefinedConstModule.default,
    "typescript/no-redundant-undefined-default-parameter":
        typescriptNoRedundantUndefinedDefaultParameterModule.default,
    "typescript/no-redundant-undefined-let":
        typescriptNoRedundantUndefinedLetModule.default,
    "typescript/no-redundant-undefined-optional":
        typescriptNoRedundantUndefinedOptionalModule.default,
    "typescript/no-redundant-undefined-promise-return-type":
        typescriptNoRedundantUndefinedPromiseReturnTypeModule.default,
    "typescript/no-redundant-undefined-readonly-property":
        typescriptNoRedundantUndefinedReadonlyPropertyModule.default,
    "typescript/no-redundant-undefined-return-type":
        typescriptNoRedundantUndefinedReturnTypeModule.default,
    "typescript/no-redundant-undefined-var":
        typescriptNoRedundantUndefinedVarModule.default,
    "typescript/no-restricted-syntax":
        typescriptNoRestrictedSyntaxModule.default,
    "typescript/no-unsafe-object-assign":
        typescriptNoUnsafeObjectAssignModule.default,
    "typescript/no-unsafe-object-assignment":
        typescriptNoUnsafeObjectAssignmentModule.default,
    "typescript/prefer-array-type-alias":
        typescriptPreferArrayTypeAliasModule.default,
    "typescript/prefer-class-method": typescriptPreferClassMethodModule.default,
    "typescript/prefer-enum": typescriptPreferEnumModule.default,
    "typescript/prefer-named-tuple-members":
        typescriptPreferNamedTupleMembersModule.default,
    "typescript/prefer-readonly-array":
        typescriptPreferReadonlyArrayModule.default,
    "typescript/prefer-readonly-array-parameter":
        typescriptPreferReadonlyArrayParameterModule.default,
    "typescript/prefer-readonly-index-signature":
        typescriptPreferReadonlyIndexSignatureModule.default,
    "typescript/prefer-readonly-map": typescriptPreferReadonlyMapModule.default,
    "typescript/prefer-readonly-property":
        typescriptPreferReadonlyPropertyModule.default,
    "typescript/prefer-readonly-record":
        typescriptPreferReadonlyRecordModule.default,
    "typescript/prefer-readonly-set": typescriptPreferReadonlySetModule.default,
    "typescript/require-prop-type-annotation":
        typescriptRequirePropTypeAnnotationModule.default,
    "typescript/require-readonly-array-property-type":
        typescriptRequireReadonlyArrayPropertyTypeModule.default,
    "typescript/require-readonly-array-return-type":
        typescriptRequireReadonlyArrayReturnTypeModule.default,
    "typescript/require-readonly-array-type-alias":
        typescriptRequireReadonlyArrayTypeAliasModule.default,
    "typescript/require-readonly-map-parameter-type":
        typescriptRequireReadonlyMapParameterTypeModule.default,
    "typescript/require-readonly-map-property-type":
        typescriptRequireReadonlyMapPropertyTypeModule.default,
    "typescript/require-readonly-map-return-type":
        typescriptRequireReadonlyMapReturnTypeModule.default,
    "typescript/require-readonly-map-type-alias":
        typescriptRequireReadonlyMapTypeAliasModule.default,
    "typescript/require-readonly-record-parameter-type":
        typescriptRequireReadonlyRecordParameterTypeModule.default,
    "typescript/require-readonly-record-property-type":
        typescriptRequireReadonlyRecordPropertyTypeModule.default,
    "typescript/require-readonly-record-return-type":
        typescriptRequireReadonlyRecordReturnTypeModule.default,
    "typescript/require-readonly-record-type-alias":
        typescriptRequireReadonlyRecordTypeAliasModule.default,
    "typescript/require-readonly-set-parameter-type":
        typescriptRequireReadonlySetParameterTypeModule.default,
    "typescript/require-readonly-set-property-type":
        typescriptRequireReadonlySetPropertyTypeModule.default,
    "typescript/require-readonly-set-return-type":
        typescriptRequireReadonlySetReturnTypeModule.default,
    "typescript/require-readonly-set-type-alias":
        typescriptRequireReadonlySetTypeAliasModule.default,
    "typescript/require-this-void": typescriptRequireThisVoidModule.default,
    "underscore-internal": underscoreInternalModule.default,
};

const ruleCatalog = buildRuleCatalog(objectKeys(baseRules));

const withCatalogDocsMetadata = (
    ruleName: string,
    ruleModule: Readonly<BaseRuleModule>
): RuleModule => {
    const catalogEntry = ruleCatalog.byRuleName[ruleName];

    if (!catalogEntry) {
        throw new Error(`Missing rule catalog entry for rule "${ruleName}".`);
    }

    const currentDocsMetadata = ruleModule.meta.docs;
    assertDefined(currentDocsMetadata);

    const hasRequiredTypeChecking = setHas(
        rulesWithRequiredTypeChecking,
        ruleName
    );
    const deprecatedMetadata = ruleModule.meta.deprecated ?? false;
    const isDeprecatedRule = deprecatedMetadata !== false;
    const docsWithCatalogMetadata: RuleDocsMetadata = {
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
    };

    return {
        ...ruleModule,
        meta: {
            ...ruleModule.meta,
            deprecated: deprecatedMetadata,
            docs: docsWithCatalogMetadata,
            languages: ["js/js"],
        },
    };
};

const decoratedRuleEntries = objectEntries(baseRules).map(
    ([ruleName, ruleModule]) =>
        [ruleName, withCatalogDocsMetadata(ruleName, ruleModule)] as const
);

let decoratedRulesAccumulator: Readonly<Record<string, RuleModule>> = {};

for (const [ruleName, ruleModule] of decoratedRuleEntries) {
    decoratedRulesAccumulator = {
        ...decoratedRulesAccumulator,
        [ruleName]: ruleModule,
    };
}

const decoratedRules: Readonly<Record<string, RuleModule>> =
    decoratedRulesAccumulator;

/**
 * Rule implementations keyed by rule name with normalized docs metadata.
 */
export const rules: Readonly<Record<string, RuleModule>> =
    Object.freeze(decoratedRules);
