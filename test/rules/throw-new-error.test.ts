import deprecatedRule from "../../src/rules/throw-new-error";
import { anyMessageError, ruleTester } from "../_internal/ruleTester";

ruleTester.run("throw-new-error", deprecatedRule, {
    invalid: [
        {
            code: "throw Error('boom');",
            errors: [anyMessageError(/.+/v)],
            output: "throw new Error('boom');",
        },
    ],
    valid: [
        {
            code: "throw new Error('boom');",
        },
    ],
});
