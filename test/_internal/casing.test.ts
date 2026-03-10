import * as fc from "fast-check";
import { describe, expect, it } from "vitest";

import { filenameStem, toCasing } from "../../src/_internal/casing";

describe("casing utilities", () => {
    it("converts common identifier styles to target casings", () => {
        expect(toCasing("my_value-name", "camelCase")).toBe("myValueName");
        expect(toCasing("my_value-name", "PascalCase")).toBe("MyValueName");
        expect(toCasing("my_value-name", "kebab-case")).toBe("my-value-name");
    });

    it("always emits lowercase output for kebab-case conversion", () => {
        fc.assert(
            fc.property(fc.string(), (value) => {
                const kebabCaseValue = toCasing(value, "kebab-case");

                expect(kebabCaseValue).toBe(kebabCaseValue.toLowerCase());
            })
        );
    });

    it("keeps camelCase and PascalCase bodies aligned", () => {
        fc.assert(
            fc.property(fc.string(), (value) => {
                const pascalCaseValue = toCasing(value, "PascalCase");
                const camelCaseValue = toCasing(value, "camelCase");

                const expectedCamelCaseValue =
                    pascalCaseValue.length === 0
                        ? ""
                        : `${pascalCaseValue[0]?.toLowerCase() ?? ""}${pascalCaseValue.slice(1)}`;

                expect(camelCaseValue).toBe(expectedCamelCaseValue);
            })
        );
    });

    it("extracts filename stems from Windows and POSIX-like paths", () => {
        expect(
            filenameStem(String.raw`C:\workspace\project\module-name.ts`)
        ).toBe("module-name");
        expect(filenameStem("/workspace/project/module-name.test.ts")).toBe(
            "module-name.test"
        );
        expect(filenameStem("/workspace/project/module-name")).toBe(
            "module-name"
        );
    });

    it("removes only the last extension segment", () => {
        fc.assert(
            fc.property(fc.string(), fc.string(), (base, extension) => {
                const normalizedBase =
                    base
                        .replaceAll("/", "x")
                        .replaceAll("\\", "x")
                        .replaceAll(".", "x") || "base";
                const normalizedExtension =
                    extension
                        .replaceAll("/", "x")
                        .replaceAll("\\", "x")
                        .replaceAll(".", "x") || "ext";
                const filePath = `/workspace/project/${normalizedBase}.${normalizedExtension}`;

                expect(filenameStem(filePath)).toBe(normalizedBase);
            })
        );
    });
});
