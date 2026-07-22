import rule from "../../src/rules/typescript-define-function-in-one-statement";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("typescript-define-function-in-one-statement", rule, {
    invalid: [
        {
            code: "function target() {} target.handler = () => {};",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "const target = () => {}; target.version = 1;",
            errors: [{ messageId: "forbidden" }],
        },
    ],
    valid: [
        {
            code: "const f = Object.assign(() => {}, { x: 1 });",
        },
        {
            code: "const target = {}; target.handler = () => {}; target.version = 1;",
        },
        {
            code: "function target() {} target.handler ??= () => {};",
        },
    ],
});
