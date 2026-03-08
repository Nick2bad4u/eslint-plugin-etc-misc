import rule from "../../src/rules/typescript-define-function-in-one-statement";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("typescript-define-function-in-one-statement", rule, {
    invalid: [
        {
            code: "function f() {} f.x = 1;",
            errors: [{ messageId: "forbidden" }],
        },
    ],
    valid: [
        {
            code: "const f = Object.assign(() => {}, { x: 1 });",
        },
    ],
});
