import rule from "../../src/rules/typescript-prefer-readonly-property";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("typescript-prefer-readonly-property", rule, {
    invalid: [
        {
            code: "class C { x: string }",
            errors: [{ messageId: "forbidden" }],
        },
    ],
    valid: [
        {
            code: "class C { readonly x: string }",
        },
        {
            code: "interface I { readonly x: string }",
        },
    ],
});
