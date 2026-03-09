import rule from "../../src/rules/sort-export-specifiers";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("sort-export-specifiers", rule, {
    invalid: [
        {
            code: "export { b, a };",
            errors: [{ messageId: "incorrectSortingOrder" }],
            output: "export { a, b };",
        },
    ],
    valid: [
        {
            code: "export { a, b };",
        },
    ],
});
