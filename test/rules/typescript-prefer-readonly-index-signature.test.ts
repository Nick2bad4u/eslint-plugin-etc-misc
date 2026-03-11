import rule from "../../src/rules/typescript-prefer-readonly-index-signature";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("typescript-prefer-readonly-index-signature", rule, {
    invalid: [
        {
            code: "interface Dict { [key: string]: string; }",
            errors: [{ messageId: "forbidden" }],
            output: "interface Dict { readonly [key: string]: string; }",
        },
        {
            code: "type Dict = { [key: string]: number };",
            errors: [{ messageId: "forbidden" }],
            output: "type Dict = { readonly [key: string]: number };",
        },
        {
            code: "type Nested = { inner: { [key: string]: string } };",
            errors: [{ messageId: "forbidden" }],
            output: "type Nested = { inner: { readonly [key: string]: string } };",
        },
    ],
    valid: [
        {
            code: "interface Dict { readonly [key: string]: string; }",
        },
        {
            code: "type Dict = { readonly [key: string]: number };",
        },
    ],
});
