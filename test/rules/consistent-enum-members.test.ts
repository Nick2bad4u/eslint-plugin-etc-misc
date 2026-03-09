import rule from "../../src/rules/consistent-enum-members";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("consistent-enum-members", rule, {
    invalid: [
        {
            code: "enum E { status = 'status' }",
            errors: [{ messageId: "forbidden" }],
        },
    ],
    valid: [
        {
            code: "enum E { STATUS = 'STATUS' }",
        },
    ],
});
