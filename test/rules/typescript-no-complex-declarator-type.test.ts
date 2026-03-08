import rule from "../../src/rules/typescript-no-complex-declarator-type";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("typescript-no-complex-declarator-type", rule, {
    invalid: [
        {
            code: "const value = (() => 1) as (() => number);",
            errors: [{ messageId: "forbidden" }],
        },
    ],
    valid: [
        {
            code: "const value: () => number = (() => 1) as (() => number);",
        },
    ],
});
