import rule from "../../src/rules/typescript-consistent-array-type-name";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("typescript-consistent-array-type-name", rule, {
    invalid: [
        {
            code: "type Item = string[];",
            errors: [{ messageId: "forbidden" }],
        },
    ],
    valid: [
        {
            code: "type Items = string[]; type ItemArray = Array<string>;",
        },
    ],
});
