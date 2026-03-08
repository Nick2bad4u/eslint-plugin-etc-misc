import rule from "../../src/rules/typescript-prefer-array-type-alias";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("typescript-prefer-array-type-alias", rule, {
    invalid: [
        {
            code: "type Item = string[];",
            errors: [{ messageId: "forbidden" }],
        },
    ],
    valid: [
        {
            code: "type Items = string[];",
        },
    ],
});
