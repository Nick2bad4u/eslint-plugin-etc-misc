import rule from "../../src/rules/sort-class-members";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("sort-class-members", rule, {
    invalid: [
        {
            code: "class Example { z() {} a() {} }",
            errors: [{ messageId: "incorrectSortingOrder" }],
        },
    ],
    valid: [
        {
            code: "class Example { a() {} z() {} }",
        },
    ],
});
