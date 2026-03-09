import rule from "../../src/rules/sort-keys";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("sort-keys", rule, {
    invalid: [
        {
            code: "const value = { b: 1, a: 2 };",
            errors: [{ messageId: "incorrectSorting" }],
            output: "const value = { a: 2, b: 1 };",
        },
    ],
    valid: [
        {
            code: "const value = { a: 1, b: 2 };",
        },
    ],
});
