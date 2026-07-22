import { describe, expect, it } from "vitest";

// JSON module specifiers require an explicit file extension at runtime.
// eslint-disable-next-line import-x/extensions -- Node.js cannot resolve this JSON module without its extension.
import packageJson from "../package.json" with { type: "json" };
// eslint-disable-next-line import-x/extensions -- Node.js requires the JSON extension at runtime.
import ruleCatalogAssignments from "../src/_internal/rule-catalog-assignments.json" with { type: "json" };
import plugin from "../src/plugin";

interface ConfigurablePlugin {
    readonly configs?: Readonly<Record<string, unknown>>;
    readonly flat?: Readonly<Record<string, unknown>>;
}

const configVariants = [
    "all",
    "allStrict",
    "allStrictWithDeprecated",
    "allWithDeprecated",
    "minimal",
    "recommended",
    "strict",
    "strictTypeChecked",
] as const;

const configNames = {
    all: "all",
    allStrict: "all-strict",
    allStrictWithDeprecated: "all-strict-with-deprecated",
    allWithDeprecated: "all-with-deprecated",
    minimal: "minimal",
    recommended: "recommended",
    strict: "strict",
    strictTypeChecked: "strict-type-checked",
} as const;

const deprecatedRuleIds = [
    "consistent-empty-lines",
    "consistent-filename",
    "consistent-source-extension",
    "default-case",
    "jsx-no-jsx-as-prop",
    "jsx-no-new-array-as-prop",
    "jsx-no-new-function-as-prop",
    "jsx-no-new-object-as-prop",
    "no-commented-out-code",
    "no-deprecated",
    "no-implicit-any-catch",
    "no-misused-generics",
    "no-relative-parent-import",
    "no-restricted-syntax",
    "no-self-import",
    "no-shadow",
    "no-underscore-export",
    "no-unnecessary-template-literal",
    "no-writeonly",
    "prefer-interface",
    "prefer-object-has-own",
    "require-jsdoc",
    "require-memo",
    "require-usememo",
    "require-usememo-children",
    "restrict-identifier-characters",
    "sort-array",
    "sort-call-signature",
    "sort-class-members",
    "sort-construct-signature",
    "sort-export-specifiers",
    "sort-keys",
    "switch-case-spacing",
    "throw-error",
    "typescript/class-methods-use-this",
    "typescript/define-function-in-one-statement",
    "typescript/exhaustive-switch",
    "typescript/no-complex-return-type",
    "typescript/no-empty-interfaces",
    "typescript/no-inferrable-types",
    "typescript/no-restricted-syntax",
    "typescript/no-unsafe-object-assignment",
    "typescript/prefer-array-type-alias",
    "typescript/prefer-enum",
    "typescript/prefer-readonly-array",
    "typescript/prefer-readonly-array-parameter",
    "typescript/prefer-readonly-map",
    "typescript/prefer-readonly-property",
    "typescript/prefer-readonly-record",
    "typescript/prefer-readonly-set",
    "typescript/require-readonly-map-parameter-type",
    "typescript/require-readonly-record-parameter-type",
    "typescript/require-readonly-set-parameter-type",
] as const;

const removedExternalAdapterRuleIds = [
    "array-type",
    "compat",
    "no-explicit-type-exports",
    "no-mixed-enums",
    "no-secret",
    "no-unused-disable",
    "no-unused-imports",
    "no-unused-vars",
    "no-useless-generics",
    "no-value-tostring",
    "prefer-includes",
    "sort-exports",
    "sort-imports",
    "throw-new-error",
    "typescript/compat",
    "unused-internal-properties",
    "uppercase-iife",
    "words",
] as const;

const removedRuntimeDependencyNames = [
    "@eslint-community/eslint-plugin-eslint-comments",
    "@typescript-eslint/eslint-plugin",
    "debug",
    "eslint-plugin-compat",
    "eslint-plugin-no-secrets",
    "eslint-plugin-simple-import-sort",
    "eslint-plugin-unicorn",
    "eslint-plugin-unused-imports",
    "eslint-plugin-write-good-comments-2",
    "semver",
    "tinyglobby",
    "tslib",
] as const;

const samePluginAliases = {
    "require-usememo": {
        canonicalRuleId: "no-unstable-react-values",
        deprecatedSince: "2.0.0",
    },
    "require-usememo-children": {
        canonicalRuleId: "no-unstable-react-children",
        deprecatedSince: "2.0.0",
    },
    "typescript/no-unsafe-object-assignment": {
        canonicalRuleId: "typescript/no-unsafe-object-assign",
        deprecatedSince: "1.2.0",
    },
} as const;

const reactStabilityRuleIds = [
    "jsx-no-jsx-as-prop",
    "jsx-no-new-array-as-prop",
    "jsx-no-new-function-as-prop",
    "jsx-no-new-object-as-prop",
    "no-unstable-react-children",
    "no-unstable-react-values",
    "require-memo",
] as const;

const recommendedRuleIds = [
    "consistent-optional-props",
    "no-assign-mutated-array",
    "no-const-enum",
    "no-function-declare-after-return",
    "no-internal",
    "no-t",
    "no-unnecessary-as-const",
    "no-unnecessary-break",
    "no-unnecessary-initialization",
    "no-vulnerable",
    "typescript/no-boolean-literal-type",
    "typescript/prefer-readonly-index-signature",
    "typescript/require-readonly-array-return-type",
    "typescript/require-this-void",
] as const;

const minimalRuleIds = [
    "consistent-optional-props",
    "no-assign-mutated-array",
    "no-const-enum",
    "no-function-declare-after-return",
    "no-internal",
    "no-t",
    "no-unnecessary-as-const",
    "no-unnecessary-break",
    "no-unnecessary-initialization",
    "no-vulnerable",
    "typescript/no-boolean-literal-type",
    "typescript/require-readonly-array-return-type",
    "typescript/require-this-void",
] as const;

const preferReadonlyRuleIds = [
    "typescript/prefer-readonly-index-signature",
] as const;

const recommendedRuleLevels = {
    "etc-misc/consistent-optional-props": "warn",
    "etc-misc/no-assign-mutated-array": "error",
    "etc-misc/no-const-enum": "warn",
    "etc-misc/no-function-declare-after-return": "warn",
    "etc-misc/no-internal": "error",
    "etc-misc/no-t": "error",
    "etc-misc/no-unnecessary-as-const": "warn",
    "etc-misc/no-unnecessary-break": "warn",
    "etc-misc/no-unnecessary-initialization": "warn",
    "etc-misc/no-vulnerable": "error",
    "etc-misc/typescript/no-boolean-literal-type": "error",
    "etc-misc/typescript/prefer-readonly-index-signature": "warn",
    "etc-misc/typescript/require-readonly-array-return-type": "warn",
    "etc-misc/typescript/require-this-void": "warn",
} as const satisfies Readonly<Record<`etc-misc/${string}`, "error" | "warn">>;

const minimalRuleLevels = {
    "etc-misc/consistent-optional-props": "warn",
    "etc-misc/no-assign-mutated-array": "error",
    "etc-misc/no-const-enum": "warn",
    "etc-misc/no-function-declare-after-return": "warn",
    "etc-misc/no-internal": "error",
    "etc-misc/no-t": "error",
    "etc-misc/no-unnecessary-as-const": "warn",
    "etc-misc/no-unnecessary-break": "warn",
    "etc-misc/no-unnecessary-initialization": "warn",
    "etc-misc/no-vulnerable": "error",
    "etc-misc/typescript/no-boolean-literal-type": "error",
    "etc-misc/typescript/require-readonly-array-return-type": "warn",
    "etc-misc/typescript/require-this-void": "warn",
} as const satisfies Readonly<Record<`etc-misc/${string}`, "error" | "warn">>;

const hasRuleDeprecationInfo = (
    value: unknown
): value is Readonly<{ availableUntil?: null | string }> =>
    typeof value === "object" && value !== null && "availableUntil" in value;

const hasSamePluginReplacement = (
    ruleId: string,
    rule: Readonly<(typeof plugin.rules)[string]>
): boolean => {
    const deprecated = rule.meta.deprecated;

    return (
        typeof deprecated === "object" &&
        (deprecated.replacedBy?.some(
            (replacement) =>
                replacement.plugin === undefined &&
                replacement.rule?.name !== undefined &&
                replacement.rule.name !== ruleId
        ) ??
            false)
    );
};

type RuleDocsMetadata = Readonly<{
    catalogId: string;
    catalogIndex: number;
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

const assertSamePluginAliasContract = (): void => {
    const exportedRuleIds = getSortedRuleNames(plugin.rules);
    const presetEligibleExportedRuleIds = exportedRuleIds.filter((ruleId) => {
        const rule = plugin.rules[ruleId];

        return rule !== undefined && !hasSamePluginReplacement(ruleId, rule);
    });
    const allWithDeprecatedConfigRuleIds = toSortedStrings(
        Object.keys(plugin.configs.allWithDeprecated.rules).map(
            (qualifiedRuleName) => qualifiedRuleName.slice("etc-misc/".length)
        )
    );

    expect(presetEligibleExportedRuleIds).toStrictEqual(
        allWithDeprecatedConfigRuleIds
    );

    for (const [aliasRuleId, aliasContract] of Object.entries(
        samePluginAliases
    )) {
        const canonicalRule = plugin.rules[aliasContract.canonicalRuleId];
        const compatibilityAliasRule = plugin.rules[aliasRuleId];

        expect(canonicalRule).toBeDefined();
        expect(compatibilityAliasRule).toBeDefined();

        if (
            canonicalRule === undefined ||
            compatibilityAliasRule === undefined
        ) {
            throw new Error(`Expected alias rule ${aliasRuleId} to exist.`);
        }

        expect(canonicalRule.meta.deprecated).toBe(false);
        expect(compatibilityAliasRule).not.toBe(canonicalRule);
        expect(compatibilityAliasRule.create).toBe(canonicalRule.create);

        const aliasDeprecation = compatibilityAliasRule.meta.deprecated;

        expect(aliasDeprecation).toBeTypeOf("object");

        if (typeof aliasDeprecation !== "object") {
            throw new TypeError(
                `Expected structured deprecation metadata for ${aliasRuleId}.`
            );
        }

        expect(aliasDeprecation.deprecatedSince).toBe(
            aliasContract.deprecatedSince
        );
        expect(aliasDeprecation.availableUntil).toBe("4.0.0");

        const aliasReplacement = aliasDeprecation.replacedBy?.[0];

        expect(aliasReplacement?.rule?.name).toBe(
            aliasContract.canonicalRuleId
        );
        expect(aliasReplacement).not.toHaveProperty("plugin");

        for (const configVariant of configVariants) {
            expect(
                `etc-misc/${aliasRuleId}` in plugin.configs[configVariant].rules
            ).toBe(false);
        }
    }

    for (const canonicalRuleId of [
        "no-unstable-react-children",
        "no-unstable-react-values",
        "typescript/no-unsafe-object-assign",
    ] as const) {
        const expectedAllSeverity = canonicalRuleId.startsWith("no-unstable-")
            ? "warn"
            : "error";

        expect(plugin.configs.all.rules[`etc-misc/${canonicalRuleId}`]).toBe(
            expectedAllSeverity
        );
        expect(
            plugin.configs.allWithDeprecated.rules[
                `etc-misc/${canonicalRuleId}`
            ]
        ).toBe(expectedAllSeverity);
        expect(
            plugin.configs.allStrict.rules[`etc-misc/${canonicalRuleId}`]
        ).toBe("error");
        expect(
            plugin.configs.allStrictWithDeprecated.rules[
                `etc-misc/${canonicalRuleId}`
            ]
        ).toBe("error");
    }
};

const assertDeprecatedRuleLifecycle = (): void => {
    for (const deprecatedRuleId of deprecatedRuleIds) {
        const rule = plugin.rules[deprecatedRuleId];

        expect(rule).toBeDefined();

        if (rule === undefined) {
            throw new Error(`Expected rule ${deprecatedRuleId} to exist.`);
        }

        expect(rule.meta.docs?.frozen).toBe(true);

        const deprecatedMetadata = rule.meta.deprecated;
        const hasDeprecationMetadata =
            hasRuleDeprecationInfo(deprecatedMetadata);
        const availableUntil = hasDeprecationMetadata
            ? deprecatedMetadata.availableUntil
            : undefined;

        expect(hasDeprecationMetadata).toBe(true);
        expect(availableUntil).toBe("4.0.0");

        const qualifiedRuleId = `etc-misc/${deprecatedRuleId}`;
        const isSamePluginAlias = hasSamePluginReplacement(
            deprecatedRuleId,
            rule
        );

        expect(qualifiedRuleId in plugin.configs.all.rules).toBe(false);
        expect(qualifiedRuleId in plugin.configs.allStrict.rules).toBe(false);
        expect(qualifiedRuleId in plugin.configs.allWithDeprecated.rules).toBe(
            !isSamePluginAlias
        );
        expect(
            qualifiedRuleId in plugin.configs.allStrictWithDeprecated.rules
        ).toBe(!isSamePluginAlias);

        if (!isSamePluginAlias) {
            expect(
                plugin.configs.allWithDeprecated.rules[qualifiedRuleId]
            ).toBe("warn");
            expect(
                plugin.configs.allStrictWithDeprecated.rules[qualifiedRuleId]
            ).toBe("warn");
        }
    }
};

const assertPresetMembershipContracts = (): void => {
    const deprecatedRuleIdSet = new Set<string>(deprecatedRuleIds);
    const minimalRuleIdSet = new Set<string>(minimalRuleIds);
    const preferReadonlyRuleIdSet = new Set<string>(preferReadonlyRuleIds);
    const recommendedRuleIdSet = new Set<string>(recommendedRuleIds);
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

    for (const minimalRuleId of minimalRuleIdSet) {
        expect(recommendedRuleIdSet.has(minimalRuleId)).toBe(true);
    }

    for (const preferReadonlyRuleId of preferReadonlyRuleIdSet) {
        expect(minimalRuleIdSet.has(preferReadonlyRuleId)).toBe(false);
        expect(recommendedRuleIdSet.has(preferReadonlyRuleId)).toBe(true);
    }

    for (const [ruleId, rule] of Object.entries(plugin.rules)) {
        const docs = rule.meta.docs as RuleDocsMetadata | undefined;

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
        expect(hasRuleDeprecationInfo(rule.meta.deprecated)).toBe(
            isDeprecatedRule
        );
        expect(rule.meta.languages).toStrictEqual(["js/js"]);
    }
};

const assertRemovedExternalSurface = (): void => {
    expect(Object.keys(plugin.rules)).toHaveLength(141);

    for (const removedRuleId of removedExternalAdapterRuleIds) {
        expect(plugin.rules).not.toHaveProperty(removedRuleId);
        expect(ruleCatalogAssignments[removedRuleId]).toStrictEqual({
            catalogIndex: expect.any(Number),
            status: "retired",
        });
    }

    for (const dependencyName of removedRuntimeDependencyNames) {
        expect(packageJson.dependencies).not.toHaveProperty(dependencyName);
    }
};

const assertStableCatalogContracts = (): void => {
    const expectedStableCatalogIds = {
        "class-match-filename": ["R002", 2],
        "no-only-tests": ["R050", 50],
        "no-unstable-react-children": ["R159", 159],
        "no-unstable-react-values": ["R158", 158],
        "typescript/require-this-void": ["R157", 157],
    } as const;

    for (const [ruleId, [catalogId, catalogIndex]] of Object.entries(
        expectedStableCatalogIds
    )) {
        const docs = plugin.rules[ruleId]?.meta.docs as
            RuleDocsMetadata | undefined;

        expect(docs?.catalogId).toBe(catalogId);
        expect(docs?.catalogIndex).toBe(catalogIndex);
    }
};

const assertReactStabilityPresetContracts = (): void => {
    for (const ruleId of reactStabilityRuleIds) {
        expect(`etc-misc/${ruleId}` in plugin.configs.minimal.rules).toBe(
            false
        );
        expect(`etc-misc/${ruleId}` in plugin.configs.recommended.rules).toBe(
            false
        );
    }
};

const assertPluginExposesRulesAndConfigs = (): void => {
    expect(plugin.meta).toStrictEqual({
        name: "eslint-plugin-etc-misc",
        namespace: "etc-misc",
        version: packageJson.version,
    });
    expect(plugin.processors).toStrictEqual({});

    for (const configVariant of configVariants) {
        expect(plugin.configs[configVariant].rules).toBeDefined();
        expect(
            plugin.configs[configVariant].plugins["etc-misc"].meta
        ).toStrictEqual(plugin.meta);
        expect(plugin.configs[configVariant].plugins["etc-misc"].rules).toBe(
            plugin.rules
        );
        expect(plugin.configs[configVariant].name).toBe(
            `etc-misc/${configNames[configVariant]}`
        );
    }

    expect(
        plugin.configs.strictTypeChecked.languageOptions?.parserOptions
            ?.projectService
    ).toBe(true);

    assertDeprecatedRuleLifecycle();
    assertPresetMembershipContracts();
    assertReactStabilityPresetContracts();
    assertRemovedExternalSurface();
    assertSamePluginAliasContract();
    assertStableCatalogContracts();
};

describe("plugin export", () => {
    it("is assignable to generic flat-config plugin shapes", () => {
        expect.hasAssertions();

        const configurablePlugin: ConfigurablePlugin = plugin;

        expect(configurablePlugin.configs?.["recommended"]).toBe(
            plugin.configs.recommended
        );
    });

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

            expect(qualifiedRuleName in plugin.configs.minimal.rules).toBe(
                false
            );
            expect(qualifiedRuleName in plugin.configs.recommended.rules).toBe(
                true
            );
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
                        RuleDocsMetadata | undefined;

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
        ).toBe(true);

        const allRuleNames = getSortedRuleNames(plugin.configs.all.rules);
        const allStrictRuleNames = getSortedRuleNames(
            plugin.configs.allStrict.rules
        );
        const expectedAllRuleNames = toSortedStrings(
            Object.entries(plugin.rules)
                .filter(
                    ([, ruleModule]) => ruleModule.meta.deprecated === false
                )
                .map(([ruleName]) => `etc-misc/${ruleName}`)
        );

        expect(allRuleNames).toStrictEqual(expectedAllRuleNames);
        expect(allStrictRuleNames).toStrictEqual(allRuleNames);

        for (const [qualifiedRuleName, configuredSeverity] of Object.entries(
            plugin.configs.allStrict.rules
        )) {
            expect(qualifiedRuleName.startsWith("etc-misc/")).toBe(true);
            expect(configuredSeverity).toBe("error");
        }

        const expectedAllWithDeprecatedRuleNames = toSortedStrings(
            Object.entries(plugin.rules)
                .filter(
                    ([ruleName, ruleModule]) =>
                        !hasSamePluginReplacement(ruleName, ruleModule)
                )
                .map(([ruleName]) => `etc-misc/${ruleName}`)
        );
        const allWithDeprecatedRuleNames = getSortedRuleNames(
            plugin.configs.allWithDeprecated.rules
        );
        const allStrictWithDeprecatedRuleNames = getSortedRuleNames(
            plugin.configs.allStrictWithDeprecated.rules
        );

        expect(allWithDeprecatedRuleNames).toStrictEqual(
            expectedAllWithDeprecatedRuleNames
        );
        expect(allStrictWithDeprecatedRuleNames).toStrictEqual(
            allWithDeprecatedRuleNames
        );

        for (const [qualifiedRuleName, configuredSeverity] of Object.entries(
            plugin.configs.allStrictWithDeprecated.rules
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
