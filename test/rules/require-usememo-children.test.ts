import { describe, expect, it } from "vitest";

import canonicalRule from "../../src/rules/no-unstable-react-children";
import rule from "../../src/rules/require-usememo-children";
import { ruleTester } from "../_internal/ruleTester";

describe("require-usememo-children compatibility alias", () => {
    it("shares the canonical implementation through its v3 removal window", () => {
        expect.hasAssertions();

        expect(rule).not.toBe(canonicalRule);
        expect(rule.create).toBe(canonicalRule.create);
        expect(rule.meta.deprecated).toMatchObject({
            availableUntil: "4.0.0",
            deprecatedSince: "2.0.0",
            replacedBy: [
                {
                    rule: { name: "no-unstable-react-children" },
                },
            ],
        });
        expect(canonicalRule.meta.deprecated).toBe(false);
    });
});

ruleTester.run("require-usememo-children", rule, {
    invalid: [
        {
            code: "function View() { return <Panel><span /></Panel>; }",
            errors: [{ messageId: "unstableChild" }],
            filename: "component.tsx",
        },
    ],
    valid: [],
});
