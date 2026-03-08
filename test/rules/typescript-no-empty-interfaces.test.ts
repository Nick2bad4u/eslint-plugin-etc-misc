import rule from "../../src/rules/typescript-no-empty-interfaces";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("typescript-no-empty-interfaces", rule, {
    invalid: [
        {
            code: "interface I {}",
            errors: [{ messageId: "forbidden" }],
        },
    ],
    valid: [
        {
            code: "interface I { x: string }",
        },
    ],
});
