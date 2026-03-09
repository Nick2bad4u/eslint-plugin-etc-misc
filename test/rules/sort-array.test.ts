import rule from "../../src/rules/sort-array";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("sort-array", rule, {
    invalid: [
        {
            code: "const values = ['b', 'a'];",
            errors: [{ messageId: "incorrectSorting" }],
            output: "const values = ['a', 'b'];",
        },
    ],
    valid: [
        {
            code: "const values = ['a', 'b'];",
        },
    ],
});
