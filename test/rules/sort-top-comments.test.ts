import rule from "../../src/rules/sort-top-comments";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("sort-top-comments", rule, {
    invalid: [
        {
            code: "// zebra\n// alpha\nconst value = 1;",
            errors: [{ messageId: "incorrectSorting" }],
            output: "// alpha\n// zebra\nconst value = 1;",
        },
    ],
    valid: [
        {
            code: "// alpha\n// zebra\nconst value = 1;",
        },
    ],
});
