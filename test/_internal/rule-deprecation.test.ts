import type { TSESLint } from "@typescript-eslint/utils";

import { describe, expect, it } from "vitest";

import {
    createDeprecatedRuleInfo,
    createReplacementRuleInfo,
    isDeprecatedSamePluginAlias,
    withDeprecatedRuleLifecycle,
} from "../../src/_internal/rule-deprecation";

describe("replacement metadata helpers", () => {
    it("keeps plugin and rule payloads when provided", () => {
        expect.hasAssertions();

        const replacementInfo = createReplacementRuleInfo({
            plugin: {
                name: "@typescript-eslint/eslint-plugin",
                url: "https://typescript-eslint.io",
            },
            rule: {
                name: "@typescript-eslint/no-unused-vars",
                url: "https://typescript-eslint.io/rules/no-unused-vars",
            },
        });

        expect(replacementInfo).toStrictEqual({
            plugin: {
                name: "@typescript-eslint/eslint-plugin",
                url: "https://typescript-eslint.io",
            },
            rule: {
                name: "@typescript-eslint/no-unused-vars",
                url: "https://typescript-eslint.io/rules/no-unused-vars",
            },
        });
    });

    it("omits undefined plugin and rule keys across all optional combinations", () => {
        expect.hasAssertions();

        const pluginReplacement = {
            name: "eslint-plugin-example",
            url: "https://example.com/plugin",
        } as const;
        const ruleReplacement = {
            name: "example/no-legacy",
            url: "https://example.com/rules/no-legacy",
        } as const;

        const replacementCases = [
            {
                expectedHasPlugin: false,
                expectedHasRule: false,
                input: {},
            },
            {
                expectedHasPlugin: false,
                expectedHasRule: true,
                input: { rule: ruleReplacement },
            },
            {
                expectedHasPlugin: true,
                expectedHasRule: false,
                input: { plugin: pluginReplacement },
            },
            {
                expectedHasPlugin: true,
                expectedHasRule: true,
                input: { plugin: pluginReplacement, rule: ruleReplacement },
            },
        ] as const;

        for (const replacementCase of replacementCases) {
            const replacementInfo = createReplacementRuleInfo(
                replacementCase.input
            );

            expect(Object.hasOwn(replacementInfo, "plugin")).toBe(
                replacementCase.expectedHasPlugin
            );
            expect(Object.hasOwn(replacementInfo, "rule")).toBe(
                replacementCase.expectedHasRule
            );
        }
    });
});

describe("deprecated rule metadata helpers", () => {
    it("includes lifecycle metadata and normalized docs URL", () => {
        expect.hasAssertions();

        const deprecationInfo = createDeprecatedRuleInfo({
            message: "Use typescript/prefer-readonly-array instead.",
            ruleId: "typescript/no-multi-type-tuples",
        });

        expect(deprecationInfo).toMatchObject({
            availableUntil: "2.0.0",
            deprecatedSince: "1.0.0",
            message: "Use typescript/prefer-readonly-array instead.",
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-no-multi-type-tuples",
        });
        expect(Object.hasOwn(deprecationInfo, "replacedBy")).toBe(false);
    });

    it("allows a rule to record the exact release that deprecated it", () => {
        expect.hasAssertions();

        const deprecationInfo = createDeprecatedRuleInfo({
            deprecatedSince: "1.2.0",
            message: "Use typescript/no-unsafe-object-assign instead.",
            ruleId: "typescript/no-unsafe-object-assignment",
        });

        expect(deprecationInfo.deprecatedSince).toBe("1.2.0");
    });

    it("identifies only different-rule replacements from the same plugin as aliases", () => {
        expect.hasAssertions();

        const samePluginAlias = createDeprecatedRuleInfo({
            message: "Use the canonical rule.",
            replacedBy: [
                createReplacementRuleInfo({
                    rule: { name: "typescript/no-unsafe-object-assign" },
                }),
            ],
            ruleId: "typescript/no-unsafe-object-assignment",
        });
        const externalReplacement = createDeprecatedRuleInfo({
            message: "Use the external rule.",
            replacedBy: [
                createReplacementRuleInfo({
                    plugin: { name: "@typescript-eslint" },
                    rule: { name: "no-unsafe-assignment" },
                }),
            ],
            ruleId: "typescript/no-unsafe-object-assignment",
        });
        const sameRuleReplacement = createDeprecatedRuleInfo({
            message: "Use this rule.",
            replacedBy: [
                createReplacementRuleInfo({
                    rule: { name: "no-restricted-syntax" },
                }),
            ],
            ruleId: "no-restricted-syntax",
        });

        expect(
            isDeprecatedSamePluginAlias({
                deprecated: samePluginAlias,
                ruleId: "typescript/no-unsafe-object-assignment",
            })
        ).toBe(true);
        expect(
            isDeprecatedSamePluginAlias({
                deprecated: externalReplacement,
                ruleId: "typescript/no-unsafe-object-assignment",
            })
        ).toBe(false);
        expect(
            isDeprecatedSamePluginAlias({
                deprecated: sameRuleReplacement,
                ruleId: "no-restricted-syntax",
            })
        ).toBe(false);
        expect(
            isDeprecatedSamePluginAlias({
                deprecated: false,
                ruleId: "example",
            })
        ).toBe(false);
        expect(
            isDeprecatedSamePluginAlias({
                deprecated: true,
                ruleId: "example",
            })
        ).toBe(false);
    });
});

describe("deprecated rule lifecycle decoration", () => {
    it("adds deprecated metadata and freezes docs when docs are present", () => {
        expect.hasAssertions();

        const ruleWithDocs: TSESLint.RuleModule<string, readonly unknown[]> = {
            create: (): Readonly<Record<string, never>> => ({}),
            defaultOptions: [],
            meta: {
                docs: {
                    description: "Legacy rule",
                },
                messages: {
                    forbidden: "Forbidden.",
                },
                schema: [],
                type: "problem",
            },
        };

        const decoratedRule = withDeprecatedRuleLifecycle(ruleWithDocs, {
            message: "Use etc-misc/no-t instead.",
            ruleId: "prefer-interface",
        });

        expect(decoratedRule.meta?.docs?.frozen).toBe(true);
        expect(decoratedRule.meta?.deprecated).toMatchObject({
            availableUntil: "2.0.0",
            deprecatedSince: "1.0.0",
            message: "Use etc-misc/no-t instead.",
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/prefer-interface",
        });
    });

    it("does not create docs metadata when the original rule had no docs object", () => {
        expect.hasAssertions();

        const ruleWithoutDocs: TSESLint.RuleModule<string, readonly unknown[]> =
            {
                create: (): Readonly<Record<string, never>> => ({}),
                defaultOptions: [],
                meta: {
                    messages: {
                        forbidden: "Forbidden.",
                    },
                    schema: [],
                    type: "problem",
                },
            };

        const decoratedRule = withDeprecatedRuleLifecycle(ruleWithoutDocs, {
            message: "Use etc-misc/no-t instead.",
            ruleId: "prefer-interface",
        });

        expect(decoratedRule.meta?.docs).toBeUndefined();
        expect(decoratedRule.meta?.deprecated).toBeDefined();
    });
});
