import { pluginMeta, type PluginMeta } from "./_internal/plugin-meta.js";
import { configs } from "./configs.js";
import { rules } from "./rules.js";

type PluginModule = {
    readonly configs: typeof configs;
    readonly meta: PluginMeta;
    readonly processors: Readonly<Record<string, never>>;
    readonly rules: typeof rules;
};

/**
 * ESLint plugin module export.
 */
const plugin: PluginModule = {
    configs,
    meta: pluginMeta,
    processors: {},
    rules,
};

export default plugin;
