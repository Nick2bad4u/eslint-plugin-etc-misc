import rule from "../../src/rules/compat";
import { anyMessageError, ruleTester } from "../_internal/ruleTester";

ruleTester.run("compat", rule, {
    invalid: [
        {
            code: "fetch('https://example.com');",
            errors: [anyMessageError(/fetch is not supported in IE 11/v)],
            settings: { browsers: ["ie 11"] },
        },
        {
            code: "globalThis.fetch('https://example.com');",
            errors: [anyMessageError(/fetch is not supported in IE 11/v)],
            settings: { browsers: ["ie 11"] },
        },
        {
            code: "new ResizeObserver(() => {});",
            errors: [
                anyMessageError(/ResizeObserver is not supported in IE 11/v),
            ],
            settings: { browsers: ["ie 11"] },
        },
    ],
    valid: [
        {
            code: "fetch('https://example.com');",
            settings: { browsers: ["chrome 120"] },
        },
        {
            code: "fetch('https://example.com');",
            settings: {
                browsers: ["ie 11"],
                polyfills: ["fetch"],
            },
        },
        {
            code: "if (typeof fetch === 'function') { fetch('/'); }",
            settings: { browsers: ["ie 11"] },
        },
        {
            code: "const fetch = () => undefined; fetch();",
            settings: { browsers: ["ie 11"] },
        },
    ],
});
