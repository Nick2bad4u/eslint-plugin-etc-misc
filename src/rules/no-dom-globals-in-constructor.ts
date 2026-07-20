import { createSsrDomGlobalsRule } from "../_internal/ssr-dom-globals.js";

/** Disallow eager browser-global access during class construction. */
const rule: ReturnType<typeof createSsrDomGlobalsRule> =
    createSsrDomGlobalsRule({
        description: "disallow browser-only globals during class construction.",
        executionContext: "constructor",
        message:
            "Browser global '{{name}}' is unsafe during server-side construction. Defer the access to a client-only lifecycle or guard it with typeof.",
        name: "no-dom-globals-in-constructor",
    });

export default rule;
