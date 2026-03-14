/* eslint-disable canonical/no-reassign-imports -- Flat-config preset object intentionally references imported preset modules. */

import { pluginMeta } from "./_internal/plugin-meta.js";
import { allStrict as allStrictConfig } from "./configs/all-strict.js";
import { all as allConfig } from "./configs/all.js";
import { recommended as recommendedConfig } from "./configs/recommended.js";
import { strict as strictConfig } from "./configs/strict.js";
import { strictTypeChecked as strictTypeCheckedConfig } from "./configs/strict-type-checked.js";
import { rules } from "./rules.js";

type PluginReference = {
    readonly meta: typeof pluginMeta;
    readonly rules: typeof rules;
};

type PresetWithPlugin<TRules extends Readonly<Record<string, RuleSeverity>>> = {
    readonly plugins: Readonly<
        Record<typeof pluginMeta.namespace, PluginReference>
    >;
    readonly rules: TRules;
};

type RuleSeverity = "error" | "warn";

const pluginReference: PluginReference = {
    meta: pluginMeta,
    rules,
};

const withPluginReference = <
    TRules extends Readonly<Record<string, RuleSeverity>>,
>(
    config: Readonly<{ readonly rules: TRules }>
): PresetWithPlugin<TRules> => ({
    plugins: {
        [pluginMeta.namespace]: pluginReference,
    },
    rules: config.rules,
});

/**
 * Available flat-config presets exported by the plugin.
 */
export type PluginConfigs = {
    readonly allStrict: PresetWithPlugin<typeof allStrictConfig.rules>;
    readonly all: PresetWithPlugin<typeof allConfig.rules>;
    readonly recommended: PresetWithPlugin<typeof recommendedConfig.rules>;
    readonly strict: PresetWithPlugin<typeof strictConfig.rules>;
    readonly strictTypeChecked: PresetWithPlugin<
        typeof strictTypeCheckedConfig.rules
    >;
};

/**
 * Plugin configuration presets.
 */
export const configs: PluginConfigs = {
    allStrict: withPluginReference(allStrictConfig),
    all: withPluginReference(allConfig),
    recommended: withPluginReference(recommendedConfig),
    strict: withPluginReference(strictConfig),
    strictTypeChecked: withPluginReference(strictTypeCheckedConfig),
};

/* eslint-enable canonical/no-reassign-imports -- Re-enable canonical import reassignment restrictions outside this intentional assembly block. */
