import rule from "../../src/rules/array-type";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("array-type", rule, {
    invalid: [
        {
            code: "type Values = Array<string>;",
            errors: [{ message: /.+/u }],
        },
    ],
    valid: [
        {
            code: "type Values = string[];",
        },
    ],
});
