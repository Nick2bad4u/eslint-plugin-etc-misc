import deprecatedRule from "../../src/rules/uppercase-iife";
import {
    anyMessageErrorWithOptions,
    ruleTester,
} from "../_internal/ruleTester";

ruleTester.run("uppercase-iife", deprecatedRule, {
    invalid: [
        {
            code: "(() => (doWork()))();",
            errors: [anyMessageErrorWithOptions(/.+/v, { suggestions: 1 })],
        },
    ],
    valid: [
        {
            code: "(() => doWork())();",
        },
    ],
});
