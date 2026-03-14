import * as fc from "fast-check";
import { describe, expect, it } from "vitest";

import { getCoreRule } from "../../src/_internal/get-core-rule";

describe("core rule resolver behavior", () => {
    it("returns a known core ESLint rule module", () => {
        const coreRule = getCoreRule("no-undef");

        expect(coreRule.create).toBeTypeOf("function");
        expect(coreRule.meta?.docs?.description).toContain("undeclared");
    });

    it("throws for non-existent rule IDs", () => {
        fc.assert(
            fc.property(
                fc.string({ maxLength: 16, minLength: 4 }),
                (suffix) => {
                    const impossibleRuleId = `etc-misc-missing-core-rule-${suffix}`;

                    expect(() => getCoreRule(impossibleRuleId)).toThrow(
                        new Error(
                            `Missing core ESLint rule "${impossibleRuleId}".`
                        )
                    );
                }
            )
        );
    });
});
