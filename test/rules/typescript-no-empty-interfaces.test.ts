import deprecatedRule from "../../src/rules/typescript-no-empty-interfaces";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("typescript-no-empty-interfaces", deprecatedRule, {
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
