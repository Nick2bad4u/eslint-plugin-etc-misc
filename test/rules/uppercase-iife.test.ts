import rule from "../../src/rules/uppercase-iife";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("uppercase-iife", rule, {
    invalid: [
        {
            code: "(() => (doWork()))();",
            errors: [{ message: /.+/v }],
        },
    ],
    valid: [
        {
            code: "(() => doWork())();",
        },
    ],
});
