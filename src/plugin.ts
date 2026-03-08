import { configs } from "./configs";
import { rules } from "./rules";

type PluginModule = {
    readonly configs: typeof configs;
    readonly rules: typeof rules;
};

/**
 * ESLint plugin module export.
 */
const plugin: PluginModule = {
    configs,
    rules,
};

export default plugin;
