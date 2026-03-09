import deprecatedRule from "../../src/rules/no-mixed-enums";
import { anyMessageError, ruleTester } from "../_internal/ruleTester";

ruleTester.run("no-mixed-enums", deprecatedRule, {
    invalid: [
        {
            code: "enum Status { open = 'open', closed = 2 }",
            errors: [anyMessageError(/.+/v)],
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
