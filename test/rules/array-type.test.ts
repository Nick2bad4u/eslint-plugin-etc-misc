import deprecatedRule from "../../src/rules/array-type";
import { anyMessageError, ruleTester } from "../_internal/ruleTester";

ruleTester.run("array-type", deprecatedRule, {
    invalid: [
        {
            code: "type Values = Array<string>;",
            errors: [anyMessageError(/.+/v)],
            output: "type Values = string[];",
        },
    ],
    valid: [
        {
            code: "type Values = string[];",
        },
    ],
});
