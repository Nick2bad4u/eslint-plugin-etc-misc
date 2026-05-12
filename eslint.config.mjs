import nick2bad4u from "eslint-config-nick2bad4u";

import etcMisc from "./plugin.mjs";

/** @type {import("eslint").Linter.Config[]} */
const config = [
    .../** @type {import("eslint").Linter.Config[]} */ (
        /** @type {unknown} */ (nick2bad4u.configs.withoutEtcMisc)
    ),

    // Local Plugin Config
    // This lets us use the plugin's rules in this repository without needing to publish the plugin first.
    {
        files: ["src/**/*.{js,mjs,cjs,ts,mts,cts,tsx,jsx}"],
        name: "Local Etc Misc",
        plugins: {
            "etc-misc": /** @type {import("eslint").ESLint.Plugin} */ (
                /** @type {unknown} */ (etcMisc)
            ),
        },
        rules: {
            .../** @type {import("eslint").Linter.RulesRecord} */ (
                /** @type {unknown} */ (etcMisc.configs.minimal.rules)
            ),
        },
    },
    // Add repository-specific config entries below as needed.
    {
        rules: {
            "copilot/require-repository-instructions-file": "off",
        },
    },
];

export default config;
