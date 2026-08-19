import { describe, expect, it } from "vitest";

import {
    getDocusaurusNodeArguments,
    webStorageFlag,
} from "../scripts/run-docusaurus.mjs";

describe("run-docusaurus", () => {
    it("omits the Web Storage flag on supported Node versions that predate it", () => {
        expect.assertions(2);

        const nodeArguments = getDocusaurusNodeArguments(
            ["build"],
            new Set<string>()
        );

        expect(nodeArguments).not.toContain(webStorageFlag);
        expect(nodeArguments.at(-1)).toBe("build");
    });

    it("passes the Web Storage flag when the active Node runtime supports it", () => {
        expect.assertions(2);

        const nodeArguments = getDocusaurusNodeArguments(
            ["build"],
            new Set([webStorageFlag])
        );

        expect(nodeArguments.at(0)).toBe(webStorageFlag);
        expect(nodeArguments.at(-1)).toBe("build");
    });
});
