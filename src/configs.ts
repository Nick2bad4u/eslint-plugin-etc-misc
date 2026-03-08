/* eslint-disable canonical/no-reassign-imports, canonical/no-re-export -- Flat-config preset object intentionally references imported preset modules. */

import { all as allConfig } from "./configs/all";
import { recommended as recommendedConfig } from "./configs/recommended";

/**
 * Available flat-config presets exported by the plugin.
 */
export type PluginConfigs = {
    readonly all: typeof allConfig;
    readonly recommended: typeof recommendedConfig;
};

/**
 * Plugin configuration presets.
 */
export const configs: PluginConfigs = {
    all: allConfig,
    recommended: recommendedConfig,
};

/* eslint-enable canonical/no-reassign-imports, canonical/no-re-export -- Re-enable canonical import/export restrictions outside this intentional assembly block. */
