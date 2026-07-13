import deprecatedRule from "../../src/rules/uppercase-iife";
import { anyMessageError, ruleTester } from "../_internal/ruleTester";

ruleTester.run("uppercase-iife", deprecatedRule, {
    invalid: [
        {
            code: "(() => (doWork()))();",
            errors: [anyMessageError(/.+/v)],
        },
    ],
    valid: [
        {
            code: "(() => doWork())();",
        },
    ],
});
