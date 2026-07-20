import rule from "../../src/rules/typescript-compat";
import { anyMessageError, ruleTester } from "../_internal/ruleTester";

ruleTester.run("typescript-compat", rule, {
    invalid: [
        {
            code: "fetch('https://example.com');",
            errors: [anyMessageError(/fetch is not supported in IE 11/v)],
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
    ],
});
