import { describe, expect, it } from "vitest";

import plugin from "../src/plugin";

describe("plugin export", () => {
    it("exposes rules and configs", () => {
        expect(plugin.rules).toBeDefined();
        expect(plugin.configs).toBeDefined();
        expect(plugin.rules["no-assign-mutated-array"]).toBeDefined();
        expect(plugin.rules["no-commented-out-code"]).toBeDefined();
        expect(plugin.rules["no-const-enum"]).toBeDefined();
        expect(plugin.rules["no-deprecated"]).toBeDefined();
        expect(plugin.rules["no-enum"]).toBeDefined();
        expect(plugin.rules["no-foreach"]).toBeDefined();
        expect(plugin.rules["no-implicit-any-catch"]).toBeDefined();
        expect(plugin.rules["no-internal"]).toBeDefined();
        expect(plugin.rules["no-t"]).toBeDefined();
        expect(plugin.rules["prefer-less-than"]).toBeDefined();
        expect(plugin.rules["underscore-internal"]).toBeDefined();
        expect(
            plugin.configs.recommended.rules["etc-misc/no-assign-mutated-array"]
        ).toBe("error");
        expect(
            plugin.configs.recommended.rules["etc-misc/no-deprecated"]
        ).toBe("warn");
        expect(
            plugin.configs.recommended.rules["etc-misc/no-implicit-any-catch"]
        ).toBe("error");
        expect(plugin.configs.recommended.rules["etc-misc/no-internal"]).toBe(
            "error"
        );
        expect(plugin.configs.recommended.rules["etc-misc/no-t"]).toBe(
            "error"
        );
    });
});
