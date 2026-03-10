import * as fc from "fast-check";
import { describe, expect, it } from "vitest";

import { compileIgnorePatterns } from "../../src/_internal/ignore-patterns";

const ignoreModes = ["name", "path"] as const;
const ignoredPatternMapArbitrary = fc.dictionary(
    fc.string(),
    fc.constantFrom(...ignoreModes)
);

describe("ignore pattern compilation", () => {
    it("splits valid patterns by mode and captures invalid expressions", () => {
        const compiledPatterns = compileIgnorePatterns({
            "[invalid": "path",
            "^internal$": "name",
            "^src/.*$": "path",
        });

        expect(compiledPatterns.patterns.name).toHaveLength(1);
        expect(compiledPatterns.patterns.path).toHaveLength(1);
        expect(compiledPatterns.patterns.name[0]?.source).toBe("^internal$");
        expect(compiledPatterns.patterns.path[0]?.source).toBe(
            String.raw`^src\/.*$`
        );
        expect(compiledPatterns.invalidPatterns).toEqual(["[invalid"]);
    });

    it("preserves compilation semantics for arbitrary input maps", () => {
        fc.assert(
            fc.property(ignoredPatternMapArbitrary, (ignored) => {
                const compiledPatterns = compileIgnorePatterns(ignored);

                const expectedInvalidPatterns: string[] = [];
                let expectedNamePatternCount = 0;
                let expectedPathPatternCount = 0;

                for (const [pattern, mode] of Object.entries(ignored)) {
                    try {
                        // eslint-disable-next-line security/detect-non-literal-regexp -- Mirrors production compilation behavior for property-based expectation checks.
                        const expression = new RegExp(pattern, "u");
                        if (mode === "name") {
                            expectedNamePatternCount +=
                                expression.flags.includes("u") ? 1 : 0;
                        } else {
                            expectedPathPatternCount +=
                                expression.flags.includes("u") ? 1 : 0;
                        }
                    } catch {
                        expectedInvalidPatterns.push(pattern);
                    }
                }

                expect(compiledPatterns.patterns.name).toHaveLength(
                    expectedNamePatternCount
                );
                expect(compiledPatterns.patterns.path).toHaveLength(
                    expectedPathPatternCount
                );
                expect(
                    compiledPatterns.invalidPatterns.toSorted((left, right) =>
                        left.localeCompare(right)
                    )
                ).toEqual(
                    expectedInvalidPatterns.toSorted((left, right) =>
                        left.localeCompare(right)
                    )
                );
            })
        );
    });
});
