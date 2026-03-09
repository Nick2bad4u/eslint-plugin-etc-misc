import deprecatedRule from "../../src/rules/no-shadow";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("no-shadow", deprecatedRule, {
    invalid: [
        {
            code: "const x = 1; function f() { const x = 2; return x; }",
            errors: [{ messageId: "forbidden" }],
        },
    ],
    valid: [
        {
            code: "const x = 1; function f() { const y = x + 1; return y; }",
        },
        {
            code: "const x = 1; enum E { x = 'x' }",
        },
    ],
});
