// JSON module specifiers require an explicit file extension at runtime.
// eslint-disable-next-line import-x/extensions -- Node.js cannot resolve this JSON module without its extension.
import packageJson from "../../package.json" with { type: "json" };

/**
 * Static type representation of {@link pluginMeta}.
 */
export type PluginMeta = Readonly<{
    name: "eslint-plugin-etc-misc";
    namespace: "etc-misc";
    version: string;
}>;

/**
 * Immutable metadata describing this ESLint plugin package.
 */
export const pluginMeta: PluginMeta = {
    name: "eslint-plugin-etc-misc",
    namespace: "etc-misc",
    version: packageJson.version,
};
