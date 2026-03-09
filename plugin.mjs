// @ts-expect-error -- `eslint-plugin-etc` does not publish type declarations.
import eslintPluginEtc from "eslint-plugin-etc";

const rules = eslintPluginEtc.rules;
const pluginMeta = Object.freeze({
    name: "eslint-plugin-etc-misc",
    namespace: "etc-misc",
    version: "1.0.0",
});

const plugin = {
    configs: {
        all: {
            rules: {},
        },
        recommended: {
            rules: {},
        },
    },
    meta: pluginMeta,
    processors: {},
    rules,
};

export const configs = plugin.configs;
export { rules };
export default plugin;
