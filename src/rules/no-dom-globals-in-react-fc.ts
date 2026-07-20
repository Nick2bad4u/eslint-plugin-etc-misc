import { createSsrDomGlobalsRule } from "../_internal/ssr-dom-globals.js";

/** Disallow browser-global access during React function rendering. */
const rule: ReturnType<typeof createSsrDomGlobalsRule> =
    createSsrDomGlobalsRule({
        description:
            "disallow browser-only globals while rendering React function components.",
        executionContext: "react-function-component",
        message:
            "Browser global '{{name}}' is unsafe during server-side function-component rendering. Defer the access to an effect or event handler, or guard it with typeof.",
        name: "no-dom-globals-in-react-fc",
    });

export default rule;
