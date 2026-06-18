import nickTwoBadFourU from "eslint-config-nick2bad4u";

import pluginExport from "./plugin.mjs";

/** @type {import("eslint").Linter.Config[]} */
const config = [
    {
        ignores: [
            ".remarkrc.mjs",
            "benchmarks/**",
            "docs/**/*.md",
            "docs/docusaurus/**",
            "knip.config.ts",
            "stryker.config.mjs",
            "vitest.stryker.config.ts",
        ],
        name: "Repository lint boundary",
    },

    .../** @type {import("eslint").Linter.Config[]} */ (
        /** @type {unknown} */ (nickTwoBadFourU.configs.withoutEtcMisc)
    ),

    // Local Plugin Config
    // This lets us use the plugin's rules in this repository without needing to publish the plugin first.
    {
        files: ["src/**/*.{js,mjs,cjs,ts,mts,cts,tsx,jsx}"],
        name: "Local Etc Misc",
        plugins: {
            "etc-misc": /** @type {import("eslint").ESLint.Plugin} */ (
                /** @type {unknown} */ (pluginExport)
            ),
        },
        rules: {
            .../** @type {import("eslint").Linter.RulesRecord} */ (
                /** @type {unknown} */ (pluginExport.configs.minimal.rules)
            ),
        },
    },
    // Add repository-specific config entries below as needed.
    {
        name: "Shared config compatibility overrides",
        rules: {
            "copilot/require-repository-instructions-file": "off",
            "import-x/max-dependencies": "off",
            "no-duplicate-imports": [
                "error",
                {
                    allowSeparateTypeImports: true,
                },
            ],
            "no-plusplus": "off",
            "sonarjs/deprecation": "off",
            "unicorn/consistent-compound-words": "off",
            "unicorn/import-style": "off",
            "unicorn/no-break-in-nested-loop": "off",
            "unicorn/no-declarations-before-early-exit": "off",
            "unicorn/no-top-level-side-effects": "off",
            "unicorn/no-unsafe-property-key": "off",
            "unicorn/no-useless-recursion": "off",
            "unicorn/no-useless-template-literals": "off",
            "unicorn/prefer-includes-over-repeated-comparisons": "off",
            "unicorn/prefer-iterator-concat": "off",
            "unicorn/prefer-minimal-ternary": "off",
            "unicorn/prefer-number-coercion": "off",
        },
    },
    {
        files: ["test/**/*.{js,mjs,cjs,ts,mts,cts,tsx,jsx}"],
        name: "Repository test compatibility overrides",
        rules: {
            "@typescript-eslint/no-unsafe-argument": "off",
            "@typescript-eslint/no-unsafe-call": "off",
            "test-signal/no-weak-existence-assertions": "off",
            "test-signal/require-assertions": "off",
            "test-signal/require-negative-path": "off",
            "unicorn/consistent-class-member-order": "off",
            "unicorn/max-nested-calls": "off",
            "unicorn/no-computed-property-existence-check": "off",
            "unicorn/no-incorrect-template-string-interpolation": "off",
            "unicorn/no-unsafe-string-replacement": "off",
            "unicorn/try-complexity": "off",
        },
    },
];

export default config;
