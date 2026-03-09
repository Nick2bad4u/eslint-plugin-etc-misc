/* eslint-disable canonical/no-reassign-imports -- Flat-config preset object intentionally references imported preset modules. */

import { pluginMeta } from "./_internal/plugin-meta.js";
import { all as allConfig } from "./configs/all.js";
import { recommended as recommendedConfig } from "./configs/recommended.js";
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

type RuleSeverity = "error";

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
    readonly all: PresetWithPlugin<typeof allConfig.rules>;
    readonly recommended: PresetWithPlugin<typeof recommendedConfig.rules>;
};

/**
 * Plugin configuration presets.
 */
export const configs: PluginConfigs = {
    all: withPluginReference(allConfig),
    recommended: withPluginReference(recommendedConfig),
};

/* eslint-enable canonical/no-reassign-imports -- Re-enable canonical import reassignment restrictions outside this intentional assembly block. */
