import { describe, expect, it } from "vitest";

import canonicalRule from "../../src/rules/no-unstable-react-values";
import rule from "../../src/rules/require-usememo";
import { ruleTester } from "../_internal/ruleTester";

describe("require-usememo compatibility alias", () => {
    it("shares the canonical implementation through its v3 removal window", () => {
        expect.hasAssertions();

        expect(rule).not.toBe(canonicalRule);
        expect(rule.create).toBe(canonicalRule.create);
        expect(rule.meta.deprecated).toMatchObject({
            availableUntil: "3.0.0",
            deprecatedSince: "2.0.0",
            replacedBy: [
                {
                    rule: { name: "no-unstable-react-values" },
                },
            ],
        });
        expect(canonicalRule.meta.deprecated).toBe(false);
    });
});

ruleTester.run("require-usememo", rule, {
    invalid: [
        {
            code: "function View() { return <Item value={{}} />; }",
            errors: [{ messageId: "unstableProp" }],
            filename: "component.tsx",
        },
    ],
    valid: [],
});
