import { createSsrDomGlobalsRule } from "../_internal/ssr-dom-globals.js";

/** Disallow browser-global access during React class rendering. */
const rule: ReturnType<typeof createSsrDomGlobalsRule> =
    createSsrDomGlobalsRule({
        description:
            "disallow browser-only globals while rendering React class components.",
        executionContext: "react-class-render",
        message:
            "Browser global '{{name}}' is unsafe during server-side class-component rendering. Defer the access to a client-only lifecycle or guard it with typeof.",
        name: "no-dom-globals-in-react-cc-render",
    });

export default rule;
