import rule from "../../src/rules/throw-new-error";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("throw-new-error", rule, {
    invalid: [
        {
            code: "throw Error('boom');",
            errors: [{ message: /.+/v }],
        },
    ],
    valid: [
        {
            code: "throw new Error('boom');",
        },
    ],
});
