import rule from "../../src/rules/object-format";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("object-format", rule, {
    invalid: [
        {
            code: "const value = { a: 1, b: 2 };",
            errors: [{ messageId: "inconsistent" }],
        },
    ],
    valid: [
        {
            code: "const value = { a: 1 };",
        },
    ],
});
