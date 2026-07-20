import { describe, expect, it } from "vitest";

import { getHtmlNestingViolation } from "../../src/_internal/html-jsx-nesting";

describe("parser-significant HTML JSX nesting relationships", () => {
    it("accepts relationships that do not change the browser parse tree", () => {
        expect.hasAssertions();

        const validRelationships = [
            [
                "a",
                [
                    "span",
                    "table",
                    "a",
                ],
            ],
            ["body", ["html"]],
            ["custom-element", ["section"]],
            ["div", ["button", "p"]],
            ["li", ["ul", "li"]],
            ["span", []],
        ] as const;

        for (const [childName, ancestorNames] of validRelationships) {
            expect(
                getHtmlNestingViolation(childName, ancestorNames)
            ).toBeUndefined();
        }
    });

    it("classifies invalid direct-parent relationships", () => {
        expect.hasAssertions();

        expect(getHtmlNestingViolation("span", ["img"])).toStrictEqual({
            kind: "void-parent",
            relatedName: "img",
        });
        expect(getHtmlNestingViolation("div", ["table"])).toStrictEqual({
            kind: "parent",
            relatedName: "table",
        });
        expect(getHtmlNestingViolation("td", ["div"])).toStrictEqual({
            kind: "parent",
            relatedName: "div",
        });
        expect(getHtmlNestingViolation("h2", ["h1"])).toStrictEqual({
            kind: "parent",
            relatedName: "h1",
        });
        expect(getHtmlNestingViolation("rt", ["p"])).toStrictEqual({
            kind: "parent",
            relatedName: "p",
        });
    });

    it("classifies invalid scoped-ancestor relationships", () => {
        expect.hasAssertions();

        const invalidRelationships = [
            [
                "a",
                ["span", "a"],
                "a",
            ],
            [
                "button",
                ["span", "button"],
                "button",
            ],
            [
                "dd",
                ["span", "dt"],
                "dt",
            ],
            [
                "div",
                ["span", "p"],
                "p",
            ],
            [
                "form",
                ["section", "form"],
                "form",
            ],
            [
                "li",
                ["span", "li"],
                "li",
            ],
            [
                "nobr",
                ["span", "nobr"],
                "nobr",
            ],
        ] as const;

        for (const [
            childName,
            ancestorNames,
            relatedName,
        ] of invalidRelationships) {
            expect(
                getHtmlNestingViolation(childName, ancestorNames)
            ).toStrictEqual({
                kind: "ancestor",
                relatedName,
            });
        }
    });
});
