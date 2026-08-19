/**
 * Repository-specific configuration for Knip dependency analysis.
 *
 * @packageDocumentation
 */
import type { KnipConfig } from "knip";

/**
 * Knip configuration that scopes entry points and dependency heuristics to the
 * repository layout.
 */
const knipConfig: KnipConfig = {
    $schema: "https://unpkg.com/knip/schema.json",
    ignore: [
        ".secretlintrc.cjs",
        "benchmarks/fixtures/**",
        "docs/docusaurus/site-docs/developer/api/typedoc-sidebar.cjs",
        "docs/docusaurus/src/components/GitHubStats.module.css.d.ts",
        "docs/docusaurus/src/css/custom.css.d.ts",
        "plugin.d.mts",
        "scripts/remark-lint-rule-doc-headings.d.mts",
        "scripts/sync-readme-rules-table.d.mts",
        "test/fixtures/**",
        "vitest.stryker.config.ts",
    ],
    ignoreBinaries: [
        "actionlint",
        "detect-secrets",
        "gitleaks",
        "grype",
        "lychee",
        "subst",
        // False positive: Knip treats its configuration file as a binary entry point.
        "knip.config.ts",
    ],
    ignoreDependencies: [
        "@double-great/stylelint-a11y",
        "@easyops-cn/docusaurus-search-local",
        "@easyops-cn/docusaurus-theme-docusaurus-search-local",
        "@microsoft/tsdoc-config",
        "@stryker-ignorer/.*",
        "@stryker-mutator/.*",
        "@stylistic/stylelint-plugin",
        "git-cliff",
        "gitcliff-config-nick2bad4u",
        "gitleaks-config-nick2bad4u",
        "jscpd-config-nick2bad4u",
        "lychee-config-nick2bad4u",
        "ncu-config-nick2bad4u",
        "postcss.*",
        "react",
        "secretlint-config-nick2bad4u",
        "stylelint.*",
        "tsdoc-config-nick2bad4u",
        "typed-css-modules",
        "typedoc-config-nick2bad4u",
        "yamllint-config-nick2bad4u",
    ],
    ignoreExportsUsedInFile: true,
    includeEntryExports: true,
    treatConfigHintsAsErrors: true,
    treatTagHintsAsErrors: true,
    rules: {
        binaries: "error",
        dependencies: "error",
        devDependencies: "error",
        duplicates: "error",
        enumMembers: "warn",
        exports: "warn",
        files: "error",
        catalog: "warn",
        cycles: "warn",
        namespaceMembers: "warn",
        nsExports: "warn",
        nsTypes: "warn",
        optionalPeerDependencies: "error",
        types: "warn",
        unlisted: "error",
        unresolved: "error",
    },
};

export default knipConfig;
