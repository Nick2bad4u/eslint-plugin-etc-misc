---
title: All preset
---

# 🟣 All

Use this preset when you want every preset-eligible rule from
`eslint-plugin-etc-misc`.

## Config key

```ts
etcMisc.configs.all;
```

## Flat Config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [etcMisc.configs.all];
```

## What it enables

- Every preset-eligible rule under `src/rules/*.ts`.
- Full active and external-deprecation coverage with `etc-misc/<rule-id>`
  entries.
- Deprecated same-plugin compatibility aliases remain manually configurable
  but are excluded to prevent duplicate execution.
- A total of **132 rules** (82 core + 50 TypeScript-scoped).

## Rules in this preset

### Core rules

- [`etc-misc/array-type`](../array-type.md) (R001)
- [`etc-misc/class-match-filename`](../class-match-filename.md) (R002)
- [`etc-misc/comment-spacing`](../comment-spacing.md) (R003)
- [`etc-misc/consistent-empty-lines`](../consistent-empty-lines.md) (R004)
- [`etc-misc/consistent-enum-members`](../consistent-enum-members.md) (R005)
- [`etc-misc/consistent-filename`](../consistent-filename.md) (R006)
- [`etc-misc/consistent-import`](../consistent-import.md) (R007)
- [`etc-misc/consistent-optional-props`](../consistent-optional-props.md) (R008)
- [`etc-misc/consistent-source-extension`](../consistent-source-extension.md) (R009)
- [`etc-misc/consistent-symbol-description`](../consistent-symbol-description.md) (R010)
- [`etc-misc/default-case`](../default-case.md) (R011)
- [`etc-misc/disallow-import`](../disallow-import.md) (R012)
- [`etc-misc/export-matching-filename-only`](../export-matching-filename-only.md) (R013)
- [`etc-misc/match-filename`](../match-filename.md) (R014)
- [`etc-misc/max-identifier-blocks`](../max-identifier-blocks.md) (R015)
- [`etc-misc/no-assign-mutated-array`](../no-assign-mutated-array.md) (R016)
- [`etc-misc/no-at-sign-import`](../no-at-sign-import.md) (R017)
- [`etc-misc/no-at-sign-internal-import`](../no-at-sign-internal-import.md) (R018)
- [`etc-misc/no-chain-coalescence-mixture`](../no-chain-coalescence-mixture.md) (R019)
- [`etc-misc/no-commented-out-code`](../no-commented-out-code.md) (R020)
- [`etc-misc/no-const-enum`](../no-const-enum.md) (R021)
- [`etc-misc/no-deprecated`](../no-deprecated.md) (R022)
- [`etc-misc/no-enum`](../no-enum.md) (R023)
- [`etc-misc/no-expression-empty-lines`](../no-expression-empty-lines.md) (R024)
- [`etc-misc/no-foreach`](../no-foreach.md) (R025)
- [`etc-misc/no-function-declare-after-return`](../no-function-declare-after-return.md) (R026)
- [`etc-misc/no-implicit-any-catch`](../no-implicit-any-catch.md) (R027)
- [`etc-misc/no-index-import`](../no-index-import.md) (R028)
- [`etc-misc/no-internal`](../no-internal.md) (R029)
- [`etc-misc/no-internal-modules`](../no-internal-modules.md) (R030)
- [`etc-misc/no-language-mixing`](../no-language-mixing.md) (R031)
- [`etc-misc/no-misused-generics`](../no-misused-generics.md) (R032)
- [`etc-misc/no-mixed-enums`](../no-mixed-enums.md) (R033)
- [`etc-misc/no-negated-conditions`](../no-negated-conditions.md) (R034)
- [`etc-misc/no-nodejs-modules`](../no-nodejs-modules.md) (R035)
- [`etc-misc/no-param-reassign`](../no-param-reassign.md) (R036)
- [`etc-misc/no-relative-parent-import`](../no-relative-parent-import.md) (R037)
- [`etc-misc/no-restricted-syntax`](../no-restricted-syntax.md) (R038)
- [`etc-misc/no-secret`](../no-secret.md) (R039)
- [`etc-misc/no-self-import`](../no-self-import.md) (R040)
- [`etc-misc/no-shadow`](../no-shadow.md) (R041)
- [`etc-misc/no-sibling-import`](../no-sibling-import.md) (R042)
- [`etc-misc/no-single-line-comment`](../no-single-line-comment.md) (R043)
- [`etc-misc/no-t`](../no-t.md) (R044)
- [`etc-misc/no-underscore-export`](../no-underscore-export.md) (R045)
- [`etc-misc/no-unnecessary-as-const`](../no-unnecessary-as-const.md) (R046)
- [`etc-misc/no-unnecessary-break`](../no-unnecessary-break.md) (R047)
- [`etc-misc/no-unnecessary-initialization`](../no-unnecessary-initialization.md) (R048)
- [`etc-misc/no-unnecessary-template-literal`](../no-unnecessary-template-literal.md) (R049)
- [`etc-misc/no-unused-disable`](../no-unused-disable.md) (R050)
- [`etc-misc/no-use-extend-native`](../no-use-extend-native.md) (R051)
- [`etc-misc/no-useless-generics`](../no-useless-generics.md) (R052)
- [`etc-misc/no-value-tostring`](../no-value-tostring.md) (R053)
- [`etc-misc/no-vulnerable`](../no-vulnerable.md) (R054)
- [`etc-misc/no-writeonly`](../no-writeonly.md) (R055)
- [`etc-misc/object-format`](../object-format.md) (R056)
- [`etc-misc/only-export-name`](../only-export-name.md) (R057)
- [`etc-misc/prefer-arrow-function-property`](../prefer-arrow-function-property.md) (R058)
- [`etc-misc/prefer-const-require`](../prefer-const-require.md) (R059)
- [`etc-misc/prefer-includes`](../prefer-includes.md) (R060)
- [`etc-misc/prefer-interface`](../prefer-interface.md) (R061)
- [`etc-misc/prefer-less-than`](../prefer-less-than.md) (R062)
- [`etc-misc/prefer-object-has-own`](../prefer-object-has-own.md) (R063)
- [`etc-misc/prefer-only-export`](../prefer-only-export.md) (R064)
- [`etc-misc/require-jsdoc`](../require-jsdoc.md) (R065)
- [`etc-misc/require-syntax`](../require-syntax.md) (R066)
- [`etc-misc/restrict-identifier-characters`](../restrict-identifier-characters.md) (R067)
- [`etc-misc/sort-array`](../sort-array.md) (R068)
- [`etc-misc/sort-call-signature`](../sort-call-signature.md) (R069)
- [`etc-misc/sort-class-members`](../sort-class-members.md) (R070)
- [`etc-misc/sort-construct-signature`](../sort-construct-signature.md) (R071)
- [`etc-misc/sort-export-specifiers`](../sort-export-specifiers.md) (R072)
- [`etc-misc/sort-keys`](../sort-keys.md) (R073)
- [`etc-misc/sort-top-comments`](../sort-top-comments.md) (R074)
- [`etc-misc/switch-case-spacing`](../switch-case-spacing.md) (R075)
- [`etc-misc/template-literal-format`](../template-literal-format.md) (R076)
- [`etc-misc/throw-error`](../throw-error.md) (R077)
- [`etc-misc/throw-new-error`](../throw-new-error.md) (R078)
- [`etc-misc/underscore-internal`](../underscore-internal.md) (R079)
- [`etc-misc/unused-internal-properties`](../unused-internal-properties.md) (R080)
- [`etc-misc/uppercase-iife`](../uppercase-iife.md) (R081)
- [`etc-misc/words`](../words.md) (R082)

### TypeScript-scoped rules

- [`etc-misc/typescript/array-callback-return-type`](../typescript-array-callback-return-type.md) (R083)
- [`etc-misc/typescript/class-methods-use-this`](../typescript-class-methods-use-this.md) (R084)
- [`etc-misc/typescript/consistent-array-type-name`](../typescript-consistent-array-type-name.md) (R085)
- [`etc-misc/typescript/define-function-in-one-statement`](../typescript-define-function-in-one-statement.md) (R086)
- [`etc-misc/typescript/exhaustive-switch`](../typescript-exhaustive-switch.md) (R087)
- [`etc-misc/typescript/no-boolean-literal-type`](../typescript-no-boolean-literal-type.md) (R088)
- [`etc-misc/typescript/no-complex-declarator-type`](../typescript-no-complex-declarator-type.md) (R089)
- [`etc-misc/typescript/no-complex-return-type`](../typescript-no-complex-return-type.md) (R090)
- [`etc-misc/typescript/no-empty-interfaces`](../typescript-no-empty-interfaces.md) (R091)
- [`etc-misc/typescript/no-inferrable-types`](../typescript-no-inferrable-types.md) (R092)
- [`etc-misc/typescript/no-multi-type-tuples`](../typescript-no-multi-type-tuples.md) (R093)
- [`etc-misc/typescript/no-never`](../typescript-no-never.md) (R094)
- [`etc-misc/typescript/no-redundant-undefined-const`](../typescript-no-redundant-undefined-const.md) (R095)
- [`etc-misc/typescript/no-redundant-undefined-default-parameter`](../typescript-no-redundant-undefined-default-parameter.md) (R096)
- [`etc-misc/typescript/no-redundant-undefined-let`](../typescript-no-redundant-undefined-let.md) (R097)
- [`etc-misc/typescript/no-redundant-undefined-optional`](../typescript-no-redundant-undefined-optional.md) (R098)
- [`etc-misc/typescript/no-redundant-undefined-promise-return-type`](../typescript-no-redundant-undefined-promise-return-type.md) (R099)
- [`etc-misc/typescript/no-redundant-undefined-readonly-property`](../typescript-no-redundant-undefined-readonly-property.md) (R100)
- [`etc-misc/typescript/no-redundant-undefined-return-type`](../typescript-no-redundant-undefined-return-type.md) (R101)
- [`etc-misc/typescript/no-redundant-undefined-var`](../typescript-no-redundant-undefined-var.md) (R102)
- [`etc-misc/typescript/no-restricted-syntax`](../typescript-no-restricted-syntax.md) (R103)
- [`etc-misc/typescript/no-unsafe-object-assign`](../typescript-no-unsafe-object-assign.md) (R104)
- [`etc-misc/typescript/prefer-array-type-alias`](../typescript-prefer-array-type-alias.md) (R106)
- [`etc-misc/typescript/prefer-class-method`](../typescript-prefer-class-method.md) (R107)
- [`etc-misc/typescript/prefer-enum`](../typescript-prefer-enum.md) (R108)
- [`etc-misc/typescript/prefer-named-tuple-members`](../typescript-prefer-named-tuple-members.md) (R109)
- [`etc-misc/typescript/prefer-readonly-array`](../typescript-prefer-readonly-array.md) (R110)
- [`etc-misc/typescript/prefer-readonly-array-parameter`](../typescript-prefer-readonly-array-parameter.md) (R111)
- [`etc-misc/typescript/prefer-readonly-index-signature`](../typescript-prefer-readonly-index-signature.md) (R112)
- [`etc-misc/typescript/prefer-readonly-map`](../typescript-prefer-readonly-map.md) (R113)
- [`etc-misc/typescript/prefer-readonly-property`](../typescript-prefer-readonly-property.md) (R114)
- [`etc-misc/typescript/prefer-readonly-record`](../typescript-prefer-readonly-record.md) (R115)
- [`etc-misc/typescript/prefer-readonly-set`](../typescript-prefer-readonly-set.md) (R116)
- [`etc-misc/typescript/require-prop-type-annotation`](../typescript-require-prop-type-annotation.md) (R117)
- [`etc-misc/typescript/require-readonly-array-property-type`](../typescript-require-readonly-array-property-type.md) (R118)
- [`etc-misc/typescript/require-readonly-array-return-type`](../typescript-require-readonly-array-return-type.md) (R119)
- [`etc-misc/typescript/require-readonly-array-type-alias`](../typescript-require-readonly-array-type-alias.md) (R120)
- [`etc-misc/typescript/require-readonly-map-parameter-type`](../typescript-require-readonly-map-parameter-type.md) (R121)
- [`etc-misc/typescript/require-readonly-map-property-type`](../typescript-require-readonly-map-property-type.md) (R122)
- [`etc-misc/typescript/require-readonly-map-return-type`](../typescript-require-readonly-map-return-type.md) (R123)
- [`etc-misc/typescript/require-readonly-map-type-alias`](../typescript-require-readonly-map-type-alias.md) (R124)
- [`etc-misc/typescript/require-readonly-record-parameter-type`](../typescript-require-readonly-record-parameter-type.md) (R125)
- [`etc-misc/typescript/require-readonly-record-property-type`](../typescript-require-readonly-record-property-type.md) (R126)
- [`etc-misc/typescript/require-readonly-record-return-type`](../typescript-require-readonly-record-return-type.md) (R127)
- [`etc-misc/typescript/require-readonly-record-type-alias`](../typescript-require-readonly-record-type-alias.md) (R128)
- [`etc-misc/typescript/require-readonly-set-parameter-type`](../typescript-require-readonly-set-parameter-type.md) (R129)
- [`etc-misc/typescript/require-readonly-set-property-type`](../typescript-require-readonly-set-property-type.md) (R130)
- [`etc-misc/typescript/require-readonly-set-return-type`](../typescript-require-readonly-set-return-type.md) (R131)
- [`etc-misc/typescript/require-readonly-set-type-alias`](../typescript-require-readonly-set-type-alias.md) (R132)
- [`etc-misc/typescript/require-this-void`](../typescript-require-this-void.md) (R133)

## Adoption guidance

Start with `recommended` first unless your project is already prepared for broad
lint enforcement. `all` is best for teams that prefer maximum rule coverage and
can commit to rule-by-rule tuning where needed.

## Related pages

- [Overview](../overview.md)
- [Getting Started](../getting-started.md)
- [Rule Reference](../)
