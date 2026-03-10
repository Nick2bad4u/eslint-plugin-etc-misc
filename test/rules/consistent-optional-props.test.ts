import rule from "../../src/rules/consistent-optional-props";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("consistent-optional-props", rule, {
    invalid: [
        {
            code: "type T = { value?: string | undefined };",
            errors: [{ messageId: "forbidden" }],
            output: "type T = { value?: string };",
        },
        {
            code: "type T = { value?: string | number | undefined };",
            errors: [{ messageId: "forbidden" }],
            output: "type T = { value?: string | number };",
        },
    ],
    valid: [
        {
            code: "type T = { value?: string };",
        },
    ],
});
