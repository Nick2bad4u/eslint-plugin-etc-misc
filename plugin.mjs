import eslintPluginEtc from "eslint-plugin-etc";

const rules = eslintPluginEtc.rules;

const plugin = {
    configs: {
        all: {
            rules: {},
        },
        recommended: {
            rules: {},
        },
    },
    rules,
};

export const configs = plugin.configs;
export { rules };
export default plugin;
