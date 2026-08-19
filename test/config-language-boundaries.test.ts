import json from "@eslint/json";
import tsParser from "@typescript-eslint/parser";
import { ESLint } from "eslint";
import { describe, expect, it } from "vitest";

import plugin from "../src/plugin";

type EslintOptions = NonNullable<ConstructorParameters<typeof ESLint>[0]>;

const createEslint = (overrideConfig: unknown): ESLint =>
    new ESLint({
        // TypeScript-eslint models rule default options as readonly, while
        // ESLint's constructor type still requires mutable rule options.
        overrideConfig: overrideConfig as EslintOptions["overrideConfig"],
        overrideConfigFile: true,
    });

describe("exported config language boundaries", () => {
    it("does not apply JavaScript-only rules to JSON language files", async () => {
        expect.hasAssertions();

        const overrideConfig = [
            {
                files: ["**/*.json"],
                language: "json/json",
                plugins: { json },
                rules: json.configs.recommended.rules,
            },
            plugin.configs.recommended,
        ];
        const eslint = createEslint(overrideConfig);

        const [result] = await eslint.lintText('{"name":"fixture"}', {
            filePath: "language-boundary.fixture.json",
        });

        expect(result?.fatalErrorCount).toBe(0);
        expect(result?.messages).toStrictEqual([]);
    });

    it("still applies the preset to supported TypeScript files", async () => {
        expect.hasAssertions();

        const overrideConfig = [
            {
                files: ["**/*.ts"],
                languageOptions: {
                    parser: tsParser,
                    parserOptions: {
                        projectService: true,
                    },
                },
            },
            plugin.configs.recommended,
        ];
        const eslint = createEslint(overrideConfig);

        const [result] = await eslint.lintText(
            'const enum Status { Ready = "ready" }',
            {
                filePath: "test/config-language-boundaries.test.ts",
            }
        );

        expect(result?.fatalErrorCount).toBe(0);
        expect(result?.messages).toStrictEqual([
            expect.objectContaining({
                ruleId: "etc-misc/no-const-enum",
                severity: 1,
            }),
        ]);
    });
});
