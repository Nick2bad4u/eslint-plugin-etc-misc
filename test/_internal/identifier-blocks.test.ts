import * as fc from "fast-check";
import { describe, expect, it } from "vitest";

import {
    countIdentifierBlocks,
    splitIdentifierBlocks,
} from "../../src/_internal/identifier-blocks";

describe("identifier block utilities", () => {
    it("splits camelCase, PascalCase, snake_case, and kebab-case consistently", () => {
        expect(splitIdentifierBlocks("myValueName")).toStrictEqual([
            "my",
            "Value",
            "Name",
        ]);
        expect(splitIdentifierBlocks("MyValueName")).toStrictEqual([
            "My",
            "Value",
            "Name",
        ]);
        expect(splitIdentifierBlocks("my_value-name")).toStrictEqual([
            "my",
            "value",
            "name",
        ]);
    });

    it("returns zero blocks for empty or punctuation-only input", () => {
        expect(countIdentifierBlocks("")).toBe(0);
        expect(countIdentifierBlocks("---___***")).toBe(0);
    });

    it("always matches split length to count for arbitrary strings", () => {
        fc.assert(
            fc.property(fc.string(), (value) => {
                const blocks = splitIdentifierBlocks(value);

                expect(countIdentifierBlocks(value)).toBe(blocks.length);
            }),
            {
                numRuns: 50,
                seed: 20_260_310,
            }
        );
    });

    it("never returns empty blocks", () => {
        fc.assert(
            fc.property(fc.string(), (value) => {
                const blocks = splitIdentifierBlocks(value);

                expect(blocks.every((block) => block.length > 0)).toBeTruthy();
            }),
            {
                numRuns: 50,
                seed: 20_260_311,
            }
        );
    });
});
