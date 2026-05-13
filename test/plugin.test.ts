import { describe, expect, it } from "vitest";

import plugin from "../src/plugin";

const deprecatedRuleIds = [
    "array-type",
    "consistent-filename",
    "consistent-source-extension",
    "no-commented-out-code",
    "no-deprecated",
    "no-mixed-enums",
    "no-relative-parent-import",
    "no-restricted-syntax",
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
] as const;

const minimalRuleIds = [
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
    "typescript/require-readonly-array-return-type",
    "typescript/require-this-void",
] as const;

const preferReadonlyRuleIds = [
    "typescript/prefer-readonly-array",
    "typescript/prefer-readonly-array-parameter",
    "typescript/prefer-readonly-index-signature",
    "typescript/prefer-readonly-map",
    "typescript/prefer-readonly-property",
    "typescript/prefer-readonly-record",
    "typescript/prefer-readonly-set",
] as const;

const recommendedRuleLevels = {
    "etc-misc/consistent-optional-props": "warn",
    "etc-misc/no-assign-mutated-array": "error",
    "etc-misc/no-const-enum": "warn",
    "etc-misc/no-function-declare-after-return": "warn",
    "etc-misc/no-implicit-any-catch": "error",
    "etc-misc/no-internal": "error",
    "etc-misc/no-t": "error",
    "etc-misc/no-unnecessary-as-const": "warn",
    "etc-misc/no-unnecessary-break": "warn",
    "etc-misc/no-unnecessary-initialization": "warn",
    "etc-misc/no-unnecessary-template-literal": "warn",
    "etc-misc/no-vulnerable": "error",
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

const minimalRuleLevels = {
    "etc-misc/consistent-optional-props": "warn",
    "etc-misc/no-assign-mutated-array": "error",
    "etc-misc/no-const-enum": "warn",
    "etc-misc/no-function-declare-after-return": "warn",
    "etc-misc/no-implicit-any-catch": "error",
    "etc-misc/no-internal": "error",
    "etc-misc/no-t": "error",
    "etc-misc/no-unnecessary-as-const": "warn",
    "etc-misc/no-unnecessary-break": "warn",
    "etc-misc/no-unnecessary-initialization": "warn",
    "etc-misc/no-unnecessary-template-literal": "warn",
    "etc-misc/no-vulnerable": "error",
    "etc-misc/throw-error": "error",
    "etc-misc/typescript/no-boolean-literal-type": "error",
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
    requiresTypeChecking?: boolean;
}>;

const toSortedStrings = (values: readonly string[]): readonly string[] =>
    values.toSorted((left, right) => left.localeCompare(right));

const getSortedRuleNames = (
    ruleMap: Readonly<Record<string, unknown>>
): readonly string[] => toSortedStrings(Object.keys(ruleMap));

const assertPluginExposesRulesAndConfigs = (): void => {
    expect(plugin.meta).toStrictEqual({
        name: "eslint-plugin-etc-misc",
        namespace: "etc-misc",
        version: "1.0.0",
    });
    expect(plugin.processors).toStrictEqual({});

    const configVariants = [
        "all",
        "allStrict",
        "minimal",
        "recommended",
        "strict",
        "strictTypeChecked",
    ] as const;

    for (const configVariant of configVariants) {
        expect(plugin.configs[configVariant].rules).toBeDefined();
        expect(
            plugin.configs[configVariant].plugins["etc-misc"].meta
        ).toStrictEqual(plugin.meta);
        expect(plugin.configs[configVariant].plugins["etc-misc"].rules).toBe(
            plugin.rules
        );
        expect(plugin.configs[configVariant].name).toBe(
            `etc-misc/${
                configVariant === "allStrict"
                    ? "all-strict"
                    : configVariant === "strictTypeChecked"
                      ? "strict-type-checked"
                      : configVariant
            }`
        );
    }

    expect(
        plugin.configs.strictTypeChecked.languageOptions?.parserOptions
            ?.projectService
    ).toBeTruthy();

    const exportedRuleIds = getSortedRuleNames(plugin.rules);
    const allConfigRuleIds = toSortedStrings(
        Object.keys(plugin.configs.all.rules).map((qualifiedRuleName) =>
            qualifiedRuleName.slice("etc-misc/".length)
        )
    );

    expect(exportedRuleIds).toStrictEqual(allConfigRuleIds);

    const recommendedRuleLevelKeys = Object.keys(
        recommendedRuleLevels
    ) as readonly (keyof typeof recommendedRuleLevels)[];
    const minimalRuleLevelKeys = Object.keys(
        minimalRuleLevels
    ) as readonly (keyof typeof minimalRuleLevels)[];

    for (const ruleName of minimalRuleLevelKeys) {
        expect(plugin.configs.minimal.rules[ruleName]).toBe(
            minimalRuleLevels[ruleName]
        );
    }

    for (const ruleName of recommendedRuleLevelKeys) {
        expect(plugin.configs.recommended.rules[ruleName]).toBe(
            recommendedRuleLevels[ruleName]
        );
    }

    const deprecatedRuleIdSet = new Set<string>(deprecatedRuleIds);
    const minimalRuleIdSet = new Set<string>(minimalRuleIds);
    const preferReadonlyRuleIdSet = new Set<string>(preferReadonlyRuleIds);
    const recommendedRuleIdSet = new Set<string>(recommendedRuleIds);

    for (const deprecatedRuleId of deprecatedRuleIds) {
        const rule = plugin.rules[deprecatedRuleId];

        expect(rule).toBeDefined();

        if (rule === undefined) {
            throw new Error(`Expected rule ${deprecatedRuleId} to exist.`);
        }

        expect(rule.meta?.docs?.frozen).toBeTruthy();

        const deprecatedMetadata = rule.meta?.deprecated;
        const hasDeprecationMetadata =
            hasRuleDeprecationInfo(deprecatedMetadata);
        const availableUntil = hasDeprecationMetadata
            ? deprecatedMetadata.availableUntil
            : undefined;

        expect(hasDeprecationMetadata).toBeTruthy();
        expect(availableUntil).toBe("2.0.0");
    }

    for (const minimalRuleId of minimalRuleIdSet) {
        expect(recommendedRuleIdSet.has(minimalRuleId)).toBeTruthy();
    }

    for (const preferReadonlyRuleId of preferReadonlyRuleIdSet) {
        expect(minimalRuleIdSet.has(preferReadonlyRuleId)).toBeFalsy();
        expect(recommendedRuleIdSet.has(preferReadonlyRuleId)).toBeTruthy();
    }

    for (const [ruleId, rule] of Object.entries(plugin.rules)) {
        const docs = rule.meta?.docs as RuleDocsMetadata | undefined;

        expect(docs).toBeDefined();

        if (docs === undefined) {
            throw new Error(`Expected docs metadata for rule ${ruleId}.`);
        }

        const isDeprecatedRule = deprecatedRuleIdSet.has(ruleId);

        expect({
            deprecated: docs.deprecated,
            frozen: docs.frozen,
            recommended: docs.recommended,
        }).toStrictEqual({
            deprecated: isDeprecatedRule,
            frozen: isDeprecatedRule,
            recommended: recommendedRuleIdSet.has(ruleId),
        });

        expect(hasRuleDeprecationInfo(rule.meta?.deprecated)).toBe(
            isDeprecatedRule
        );
    }
};

describe("plugin export", () => {
    it("exposes rules and configs", () => {
        expect.hasAssertions();

        assertPluginExposesRulesAndConfigs();
    });

    it("keeps strict presets as progressive supersets", () => {
        expect.hasAssertions();

        const minimalRuleLevelKeys = Object.keys(
            minimalRuleLevels
        ) as readonly (keyof typeof minimalRuleLevels)[];

        for (const ruleName of minimalRuleLevelKeys) {
            expect(plugin.configs.recommended.rules[ruleName]).toBe(
                plugin.configs.minimal.rules[ruleName]
            );
        }

        for (const preferReadonlyRuleId of preferReadonlyRuleIds) {
            const qualifiedRuleName = `etc-misc/${preferReadonlyRuleId}`;

            expect(
                qualifiedRuleName in plugin.configs.minimal.rules
            ).toBeFalsy();
            expect(
                qualifiedRuleName in plugin.configs.recommended.rules
            ).toBeTruthy();
        }

        const recommendedRuleLevelKeys = Object.keys(
            recommendedRuleLevels
        ) as readonly (keyof typeof recommendedRuleLevels)[];

        for (const ruleName of recommendedRuleLevelKeys) {
            expect(plugin.configs.strict.rules[ruleName]).toBe("error");
        }

        const recommendedRuleNames = getSortedRuleNames(
            plugin.configs.recommended.rules
        );
        const strictRuleNames = getSortedRuleNames(plugin.configs.strict.rules);

        expect(strictRuleNames).toStrictEqual(recommendedRuleNames);

        const typedRequiredNonDeprecatedRuleNames = toSortedStrings(
            Object.entries(plugin.rules)
                .filter(([, ruleModule]) => {
                    const docs = ruleModule.meta.docs as
                        | RuleDocsMetadata
                        | undefined;

                    return (
                        ruleModule.meta.deprecated === false &&
                        docs?.requiresTypeChecking === true
                    );
                })
                .map(([ruleName]) => `etc-misc/${ruleName}`)
        );

        const expectedStrictTypeCheckedRuleNames = toSortedStrings([
            ...new Set([
                ...strictRuleNames,
                ...typedRequiredNonDeprecatedRuleNames,
            ]),
        ]);
        const strictTypeCheckedRuleNames = getSortedRuleNames(
            plugin.configs.strictTypeChecked.rules
        );

        expect(strictTypeCheckedRuleNames).toStrictEqual(
            expectedStrictTypeCheckedRuleNames
        );

        for (const strictTypeCheckedRuleName of strictTypeCheckedRuleNames) {
            expect(
                plugin.configs.strictTypeChecked.rules[
                    strictTypeCheckedRuleName
                ]
            ).toBe("error");
        }

        expect(
            plugin.configs.strictTypeChecked.languageOptions?.parserOptions
                ?.projectService
        ).toBeTruthy();

        const allRuleNames = getSortedRuleNames(plugin.configs.all.rules);
        const allStrictRuleNames = getSortedRuleNames(
            plugin.configs.allStrict.rules
        );

        expect(allStrictRuleNames).toStrictEqual(allRuleNames);

        for (const [qualifiedRuleName, configuredSeverity] of Object.entries(
            plugin.configs.allStrict.rules
        )) {
            const shortRuleName = qualifiedRuleName.slice("etc-misc/".length);
            const ruleModule = plugin.rules[shortRuleName];

            expect(ruleModule).toBeDefined();

            if (ruleModule === undefined) {
                throw new Error(
                    `Expected exported rule for ${qualifiedRuleName}.`
                );
            }

            const expectedSeverity =
                ruleModule.meta.deprecated === false ? "error" : "warn";

            expect(configuredSeverity).toBe(expectedSeverity);
        }
    });
});
