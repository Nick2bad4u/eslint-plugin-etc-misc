/* eslint-disable canonical/no-reassign-imports -- Flat-config preset object intentionally references imported preset modules. */

import type { UnknownRecord } from "type-fest";

import {
    pluginMeta,
    type PluginMeta,
    type PluginNamespace,
} from "./_internal/plugin-meta.js";
import { allStrict as allStrictConfig } from "./configs/all-strict.js";
import { all as allConfig } from "./configs/all.js";
import { minimal as minimalConfig } from "./configs/minimal.js";
import { recommended as recommendedConfig } from "./configs/recommended.js";
import { strictTypeChecked as strictTypeCheckedConfig } from "./configs/strict-type-checked.js";
import { strict as strictConfig } from "./configs/strict.js";
import { rules } from "./rules.js";

interface PluginReference {
    readonly meta: PluginMeta;
    readonly rules: typeof rules;
}

interface PresetWithPlugin<
    TName extends string,
    TRules extends Readonly<Record<string, RuleSeverity>>,
> {
    readonly name: TName;
    readonly plugins: Readonly<Record<PluginNamespace, PluginReference>>;
    readonly rules: TRules;
}

type RuleSeverity = "error" | "warn";

const pluginReference: PluginReference = {
    meta: pluginMeta,
    rules,
};

const withPluginReference = <
    TName extends string,
    TRules extends Readonly<Record<string, RuleSeverity>>,
>(
    config: Readonly<{ readonly name: TName; readonly rules: TRules }>
): PresetWithPlugin<TName, TRules> => ({
    name: config.name,
    plugins: {
        [pluginMeta.namespace]: pluginReference,
    },
    rules: config.rules,
});

/**
 * Available flat-config presets exported by the plugin.
 */
export interface PluginConfigs extends Readonly<UnknownRecord> {
    readonly all: PresetWithPlugin<
        typeof allConfig.name,
        typeof allConfig.rules
    >;
    readonly allStrict: PresetWithPlugin<
        typeof allStrictConfig.name,
        typeof allStrictConfig.rules
    >;
    readonly minimal: PresetWithPlugin<
        typeof minimalConfig.name,
        typeof minimalConfig.rules
    >;
    readonly recommended: PresetWithPlugin<
        typeof recommendedConfig.name,
        typeof recommendedConfig.rules
    >;
    readonly strict: PresetWithPlugin<
        typeof strictConfig.name,
        typeof strictConfig.rules
    >;
    readonly strictTypeChecked: PresetWithPlugin<
        typeof strictTypeCheckedConfig.name,
        typeof strictTypeCheckedConfig.rules
    > & {
        readonly languageOptions: typeof strictTypeCheckedConfig.languageOptions;
    };
}

/**
 * Plugin configuration presets.
 */
export const configs: PluginConfigs = {
    all: withPluginReference(allConfig),
    allStrict: withPluginReference(allStrictConfig),
    minimal: withPluginReference(minimalConfig),
    recommended: withPluginReference(recommendedConfig),
    strict: withPluginReference(strictConfig),
    strictTypeChecked: {
        ...withPluginReference(strictTypeCheckedConfig),
        languageOptions: strictTypeCheckedConfig.languageOptions,
    },
};

/* eslint-enable canonical/no-reassign-imports -- Re-enable canonical import reassignment restrictions outside this intentional assembly block. */
