import rule from "../../src/rules/consistent-optional-props";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("consistent-optional-props", rule, {
    invalid: [
        {
            code: "type T = { value?: string | undefined };",
            errors: [{ messageId: "forbidden" }],
        },
    ],
    valid: [
        {
            code: "type T = { value?: string };",
        },
    ],
});
