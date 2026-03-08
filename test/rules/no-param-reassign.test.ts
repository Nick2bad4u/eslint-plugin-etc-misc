import rule from "../../src/rules/no-param-reassign";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("no-param-reassign", rule, {
    invalid: [
        {
            code: "function f(value) { sideEffect(); value += 1; }",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "const fn = (value) => { sideEffect(); value++; };",
            errors: [{ messageId: "forbidden" }],
        },
    ],
    valid: [
        {
            code: "const fn = (value) => { value++; };",
        },
        {
            code: "function f(value) { value += 1; sideEffect(); }",
        },
        {
            code: "function f(value) { const nextValue = value + 1; return nextValue; }",
        },
    ],
});
