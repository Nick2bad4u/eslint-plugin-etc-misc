import { createSsrDomGlobalsRule } from "../_internal/ssr-dom-globals.js";

/** Disallow eager browser-global access during module evaluation. */
const rule: ReturnType<typeof createSsrDomGlobalsRule> =
    createSsrDomGlobalsRule({
        description: "disallow browser-only globals during module evaluation.",
        executionContext: "module",
        message:
            "Browser global '{{name}}' is unavailable during server-side module evaluation. Defer the access or guard it with typeof.",
        name: "no-dom-globals-in-module-scope",
    });

export default rule;
