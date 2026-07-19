/**
 * Immutable metadata describing this ESLint plugin package.
 */
export const pluginMeta = {
    name: "eslint-plugin-etc-misc",
    namespace: "etc-misc",
    version: "1.2.0",
} as const;

/**
 * Static type representation of {@link pluginMeta}.
 */
export type PluginMeta = typeof pluginMeta;
