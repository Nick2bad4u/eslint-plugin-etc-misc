import type { Linter } from "eslint";

declare const eslintLinterMarker: Linter.Config | undefined;

declare module "eslint-plugin-write-good-comments-2" {
    const plugin: unknown;

    export default plugin;
}
