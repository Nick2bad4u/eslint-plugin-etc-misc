import rule from "../../src/rules/typescript-no-multi-type-tuples";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("typescript-no-multi-type-tuples", rule, {
    invalid: [
        {
            code: "type T = [string | number];",
            errors: [{ messageId: "forbidden" }],
        },
    ],
    valid: [
        {
            code: "type Value = string | number; type T = [Value];",
        },
    ],
});
