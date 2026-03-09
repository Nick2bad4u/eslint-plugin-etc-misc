import deprecatedRule from "../../src/rules/require-jsdoc";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("require-jsdoc", deprecatedRule, {
    invalid: [
        {
            code: "function f() {}",
            errors: [{ messageId: "missing" }],
            options: [{ kinds: ["function"] }],
        },
    ],
    valid: [
        {
            code: "/** docs */ function f() {}",
            options: [{ kinds: ["function"] }],
        },
    ],
});
