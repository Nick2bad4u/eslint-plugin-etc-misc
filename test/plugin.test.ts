import { describe, expect, expectTypeOf, it } from "vitest";

import plugin from "../src/plugin";

const deprecatedRuleIds = [
    "array-type",
    "consistent-filename",
    "consistent-source-extension",
    "no-commented-out-code",
    "no-deprecated",
    "no-mixed-enums",
    "no-restricted-syntax",
    "no-relative-parent-import",
    "no-secret",
    "no-self-import",
    "no-shadow",
    "no-unused-disable",
    "no-useless-generics",
    "no-value-tostring",
    "prefer-includes",
    "prefer-interface",
    "prefer-object-has-own",
    "require-jsdoc",
    "sort-class-members",
    "switch-case-spacing",
    "throw-new-error",
    "typescript/class-methods-use-this",
    "typescript/exhaustive-switch",
    "typescript/no-empty-interfaces",
    "typescript/no-inferrable-types",
    "typescript/no-restricted-syntax",
    "unused-internal-properties",
    "uppercase-iife",
    "words",
] as const;

const recommendedRuleIds = [
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
] as const;

const recommendedRuleLevels = {
    "etc-misc/consistent-optional-props": "warn",
    "etc-misc/no-assign-mutated-array": "error",
    "etc-misc/no-const-enum": "warn",
    "etc-misc/no-implicit-any-catch": "error",
    "etc-misc/no-internal": "error",
    "etc-misc/no-t": "error",
    "etc-misc/no-unnecessary-as-const": "warn",
    "etc-misc/no-unnecessary-break": "warn",
    "etc-misc/no-unnecessary-initialization": "warn",
    "etc-misc/no-unnecessary-template-literal": "warn",
    "etc-misc/throw-error": "error",
    "etc-misc/typescript/no-boolean-literal-type": "error",
    "etc-misc/typescript/prefer-readonly-array": "warn",
    "etc-misc/typescript/prefer-readonly-array-parameter": "warn",
    "etc-misc/typescript/prefer-readonly-index-signature": "warn",
    "etc-misc/typescript/prefer-readonly-map": "warn",
    "etc-misc/typescript/prefer-readonly-property": "warn",
    "etc-misc/typescript/prefer-readonly-record": "warn",
    "etc-misc/typescript/prefer-readonly-set": "warn",
    "etc-misc/typescript/require-readonly-array-return-type": "warn",
    "etc-misc/typescript/require-this-void": "warn",
} as const satisfies Readonly<Record<`etc-misc/${string}`, "error" | "warn">>;

const hasRuleDeprecationInfo = (
    value: unknown
): value is Readonly<{ availableUntil?: null | string }> =>
    typeof value === "object" && value !== null && "availableUntil" in value;

type RuleDocsMetadata = Readonly<{
    deprecated: boolean;
    frozen: boolean;
    recommended: boolean;
}>;

describe("plugin export", () => {
    it("exposes rules and configs", () => {
        expect(plugin.meta).toEqual({
            name: "eslint-plugin-etc-misc",
            namespace: "etc-misc",
            version: "1.0.0",
        });
        expect(plugin.processors).toEqual({});
        expect(plugin.rules).toBeDefined();
        expect(plugin.configs).toBeDefined();
        expect(plugin.configs.all.plugins["etc-misc"]).toBeDefined();
        expect(plugin.configs.recommended.plugins["etc-misc"]).toBeDefined();
        expect(plugin.configs.recommended.plugins["etc-misc"].meta).toEqual(
            plugin.meta
        );
        expect(plugin.configs.recommended.plugins["etc-misc"].rules).toBe(
            plugin.rules
        );
        expect(plugin.rules["array-type"]).toBeDefined();
        expect(plugin.rules["class-match-filename"]).toBeDefined();
        expect(plugin.rules["comment-spacing"]).toBeDefined();
        expect(plugin.rules["consistent-empty-lines"]).toBeDefined();
        expect(plugin.rules["consistent-enum-members"]).toBeDefined();
        expect(plugin.rules["consistent-filename"]).toBeDefined();
        expect(plugin.rules["consistent-import"]).toBeDefined();
        expect(plugin.rules["consistent-optional-props"]).toBeDefined();
        expect(plugin.rules["consistent-source-extension"]).toBeDefined();
        expect(plugin.rules["consistent-symbol-description"]).toBeDefined();
        expect(plugin.rules["default-case"]).toBeDefined();
        expect(plugin.rules["disallow-import"]).toBeDefined();
        expect(plugin.rules["export-matching-filename-only"]).toBeDefined();
        expect(plugin.rules["match-filename"]).toBeDefined();
        expect(plugin.rules["max-identifier-blocks"]).toBeDefined();
        expect(plugin.rules["no-assign-mutated-array"]).toBeDefined();
        expect(plugin.rules["no-at-sign-import"]).toBeDefined();
        expect(plugin.rules["no-at-sign-internal-import"]).toBeDefined();
        expect(plugin.rules["no-chain-coalescence-mixture"]).toBeDefined();
        expect(plugin.rules["no-commented-out-code"]).toBeDefined();
        expect(plugin.rules["no-const-enum"]).toBeDefined();
        expect(plugin.rules["no-deprecated"]).toBeDefined();
        expect(plugin.rules["no-enum"]).toBeDefined();
        expect(plugin.rules["no-foreach"]).toBeDefined();
        expect(plugin.rules["no-implicit-any-catch"]).toBeDefined();
        expect(plugin.rules["no-index-import"]).toBeDefined();
        expect(plugin.rules["no-internal-modules"]).toBeDefined();
        expect(plugin.rules["no-internal"]).toBeDefined();
        expect(plugin.rules["no-language-mixing"]).toBeDefined();
        expect(plugin.rules["no-mixed-enums"]).toBeDefined();
        expect(plugin.rules["no-misused-generics"]).toBeDefined();
        expect(plugin.rules["no-negated-conditions"]).toBeDefined();
        expect(plugin.rules["no-nodejs-modules"]).toBeDefined();
        expect(plugin.rules["no-param-reassign"]).toBeDefined();
        expect(plugin.rules["no-restricted-syntax"]).toBeDefined();
        expect(plugin.rules["no-relative-parent-import"]).toBeDefined();
        expect(plugin.rules["no-secret"]).toBeDefined();
        expect(plugin.rules["no-self-import"]).toBeDefined();
        expect(plugin.rules["no-shadow"]).toBeDefined();
        expect(plugin.rules["no-single-line-comment"]).toBeDefined();
        expect(plugin.rules["no-sibling-import"]).toBeDefined();
        expect(plugin.rules["no-t"]).toBeDefined();
        expect(plugin.rules["no-unused-disable"]).toBeDefined();
        expect(plugin.rules["no-useless-generics"]).toBeDefined();
        expect(plugin.rules["no-value-tostring"]).toBeDefined();
        expect(plugin.rules["no-writeonly"]).toBeDefined();
        expect(plugin.rules["no-unnecessary-template-literal"]).toBeDefined();
        expect(plugin.rules["no-expression-empty-lines"]).toBeDefined();
        expect(plugin.rules["object-format"]).toBeDefined();
        expect(plugin.rules["only-export-name"]).toBeDefined();
        expect(plugin.rules["no-underscore-export"]).toBeDefined();
        expect(plugin.rules["no-unnecessary-as-const"]).toBeDefined();
        expect(plugin.rules["no-unnecessary-break"]).toBeDefined();
        expect(plugin.rules["no-unnecessary-initialization"]).toBeDefined();
        expect(plugin.rules["prefer-arrow-function-property"]).toBeDefined();
        expect(plugin.rules["prefer-const-require"]).toBeDefined();
        expect(plugin.rules["prefer-includes"]).toBeDefined();
        expect(plugin.rules["prefer-interface"]).toBeDefined();
        expect(plugin.rules["prefer-less-than"]).toBeDefined();
        expect(plugin.rules["prefer-only-export"]).toBeDefined();
        expect(plugin.rules["prefer-object-has-own"]).toBeDefined();
        expect(plugin.rules["require-jsdoc"]).toBeDefined();
        expect(plugin.rules["require-syntax"]).toBeDefined();
        expect(plugin.rules["restrict-identifier-characters"]).toBeDefined();
        expect(plugin.rules["sort-array"]).toBeDefined();
        expect(plugin.rules["sort-call-signature"]).toBeDefined();
        expect(plugin.rules["sort-class-members"]).toBeDefined();
        expect(plugin.rules["sort-construct-signature"]).toBeDefined();
        expect(plugin.rules["sort-export-specifiers"]).toBeDefined();
        expect(plugin.rules["sort-keys"]).toBeDefined();
        expect(plugin.rules["sort-top-comments"]).toBeDefined();
        expect(plugin.rules["switch-case-spacing"]).toBeDefined();
        expect(plugin.rules["template-literal-format"]).toBeDefined();
        expect(plugin.rules["throw-error"]).toBeDefined();
        expect(plugin.rules["throw-new-error"]).toBeDefined();
        expect(
            plugin.rules["typescript/array-callback-return-type"]
        ).toBeDefined();
        expect(plugin.rules["typescript/class-methods-use-this"]).toBeDefined();
        expect(
            plugin.rules["typescript/consistent-array-type-name"]
        ).toBeDefined();
        expect(
            plugin.rules["typescript/define-function-in-one-statement"]
        ).toBeDefined();
        expect(plugin.rules["typescript/exhaustive-switch"]).toBeDefined();
        expect(
            plugin.rules["typescript/no-boolean-literal-type"]
        ).toBeDefined();
        expect(
            plugin.rules["typescript/no-complex-declarator-type"]
        ).toBeDefined();
        expect(plugin.rules["typescript/no-complex-return-type"]).toBeDefined();
        expect(plugin.rules["typescript/no-empty-interfaces"]).toBeDefined();
        expect(plugin.rules["typescript/no-inferrable-types"]).toBeDefined();
        expect(plugin.rules["typescript/no-multi-type-tuples"]).toBeDefined();
        expect(plugin.rules["typescript/no-never"]).toBeDefined();
        expect(plugin.rules["typescript/no-restricted-syntax"]).toBeDefined();
        expect(
            plugin.rules["typescript/no-unsafe-object-assign"]
        ).toBeDefined();
        expect(
            plugin.rules["typescript/no-unsafe-object-assignment"]
        ).toBeDefined();
        expect(
            plugin.rules["typescript/prefer-array-type-alias"]
        ).toBeDefined();
        expect(plugin.rules["typescript/prefer-class-method"]).toBeDefined();
        expect(plugin.rules["typescript/prefer-enum"]).toBeDefined();
        expect(plugin.rules["typescript/prefer-readonly-array"]).toBeDefined();
        expect(
            plugin.rules["typescript/prefer-readonly-array-parameter"]
        ).toBeDefined();
        expect(
            plugin.rules["typescript/prefer-readonly-index-signature"]
        ).toBeDefined();
        expect(plugin.rules["typescript/prefer-readonly-map"]).toBeDefined();
        expect(
            plugin.rules["typescript/prefer-readonly-property"]
        ).toBeDefined();
        expect(plugin.rules["typescript/prefer-readonly-record"]).toBeDefined();
        expect(plugin.rules["typescript/prefer-readonly-set"]).toBeDefined();
        expect(
            plugin.rules["typescript/require-prop-type-annotation"]
        ).toBeDefined();
        expect(
            plugin.rules["typescript/require-readonly-array-return-type"]
        ).toBeDefined();
        expect(
            plugin.rules["typescript/require-readonly-map-parameter-type"]
        ).toBeDefined();
        expect(
            plugin.rules["typescript/require-readonly-map-return-type"]
        ).toBeDefined();
        expect(
            plugin.rules["typescript/require-readonly-map-type-alias"]
        ).toBeDefined();
        expect(
            plugin.rules["typescript/require-readonly-record-parameter-type"]
        ).toBeDefined();
        expect(
            plugin.rules["typescript/require-readonly-record-property-type"]
        ).toBeDefined();
        expect(
            plugin.rules["typescript/require-readonly-record-return-type"]
        ).toBeDefined();
        expect(
            plugin.rules["typescript/require-readonly-record-type-alias"]
        ).toBeDefined();
        expect(
            plugin.rules["typescript/require-readonly-set-parameter-type"]
        ).toBeDefined();
        expect(
            plugin.rules["typescript/require-readonly-set-return-type"]
        ).toBeDefined();
        expect(
            plugin.rules["typescript/require-readonly-set-type-alias"]
        ).toBeDefined();
        expect(
            plugin.rules["typescript/require-readonly-array-type-alias"]
        ).toBeDefined();
        expect(plugin.rules["typescript/require-this-void"]).toBeDefined();
        expect(plugin.rules["uppercase-iife"]).toBeDefined();
        expect(plugin.rules["unused-internal-properties"]).toBeDefined();
        expect(plugin.rules["underscore-internal"]).toBeDefined();
        expect(plugin.rules["words"]).toBeDefined();
        expect(
            "etc-misc/no-deprecated" in plugin.configs.recommended.rules
        ).toBeFalsy();

        const recommendedRuleLevelKeys = Object.keys(
            recommendedRuleLevels
        ) as readonly (keyof typeof recommendedRuleLevels)[];

        for (const ruleName of recommendedRuleLevelKeys) {
            const level = recommendedRuleLevels[ruleName];

            expect(plugin.configs.recommended.rules[ruleName]).toBe(level);
        }

        for (const deprecatedRuleId of deprecatedRuleIds) {
            const rule = plugin.rules[deprecatedRuleId];

            expect(rule).toBeDefined();

            if (rule === undefined) {
                throw new Error(`Expected rule ${deprecatedRuleId} to exist.`);
            }

            expect(rule.meta?.docs?.frozen).toBeTruthy();

            expect(hasRuleDeprecationInfo(rule.meta?.deprecated)).toBeTruthy();

            if (hasRuleDeprecationInfo(rule.meta?.deprecated)) {
                expect(rule.meta.deprecated.availableUntil).toBe("2.0.0");
            }
        }

        const deprecatedRuleIdSet = new Set<string>(deprecatedRuleIds);
        const recommendedRuleIdSet = new Set<string>(recommendedRuleIds);

        for (const [ruleId, rule] of Object.entries(plugin.rules)) {
            const docs = rule.meta?.docs as RuleDocsMetadata | undefined;

            expect(docs).toBeDefined();

            if (docs === undefined) {
                throw new Error(`Expected docs metadata for rule ${ruleId}.`);
            }

            expectTypeOf(docs.deprecated).toBeBoolean();
            expectTypeOf(docs.frozen).toBeBoolean();
            expectTypeOf(docs.recommended).toBeBoolean();

            expect(docs.deprecated).toBe(deprecatedRuleIdSet.has(ruleId));
            expect(docs.frozen).toBe(deprecatedRuleIdSet.has(ruleId));
            expect(docs.recommended).toBe(recommendedRuleIdSet.has(ruleId));

            if (deprecatedRuleIdSet.has(ruleId)) {
                expect(
                    hasRuleDeprecationInfo(rule.meta?.deprecated)
                ).toBeTruthy();
            } else {
                expect(rule.meta?.deprecated).toBeFalsy();
            }
        }
    });
});
