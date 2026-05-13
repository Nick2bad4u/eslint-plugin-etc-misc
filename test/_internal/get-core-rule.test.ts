import * as fc from "fast-check";
import { assertDefined, keyIn } from "ts-extras";
import { describe, expect, it } from "vitest";

import { getCoreRule } from "../../src/_internal/get-core-rule";

type CoreRuleModule = Readonly<{
    readonly create: (...arguments_: readonly unknown[]) => unknown;
    readonly meta?: Readonly<{
        readonly docs?: Readonly<{
            readonly description?: string;
        }>;
    }>;
}>;

type UnknownRecord = Readonly<Record<string, unknown>>;

const isUnknownRecord = (value: unknown): value is UnknownRecord =>
    typeof value === "object" && value !== null;

const isCoreRuleModule = (value: unknown): value is CoreRuleModule =>
    isUnknownRecord(value) &&
    keyIn(value, "create") &&
    typeof value["create"] === "function";

const asCoreRuleModule = (value: unknown): CoreRuleModule => {
    if (isCoreRuleModule(value)) {
        return value;
    }

    throw new TypeError(
        "Expected getCoreRule() to return a core ESLint rule module."
    );
};

describe("core rule resolver behavior", () => {
    it("returns a known core ESLint rule module", () => {
        expect.hasAssertions();

        const coreRule = asCoreRuleModule(getCoreRule("no-undef"));
        const docs = coreRule.meta?.docs;
        assertDefined(docs?.description);

        expect(coreRule.create).toBeTypeOf("function");
        expect(docs.description).toContain("undeclared");
    });

    it("throws for non-existent rule IDs", () => {
        expect.hasAssertions();

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
