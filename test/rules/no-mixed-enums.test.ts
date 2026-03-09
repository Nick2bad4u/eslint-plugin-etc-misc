import rule from "../../src/rules/no-mixed-enums";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("no-mixed-enums", rule, {
    invalid: [
        {
            code: "enum Status { open = 'open', closed = 2 }",
            errors: [{ message: /.+/v }],
            filename: "file.ts",
        },
    ],
    valid: [
        {
            code: "enum Status { open = 1, closed = 2 }",
            filename: "file.ts",
        },
    ],
});
