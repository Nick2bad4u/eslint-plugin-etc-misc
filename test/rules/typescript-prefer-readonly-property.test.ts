import rule from "../../src/rules/typescript-prefer-readonly-property";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("typescript-prefer-readonly-property", rule, {
    invalid: [
        {
            code: "class C { x: string }",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestAddReadonly",
                            output: "class C { readonly x: string }",
                        },
                    ],
                },
            ],
            output: "class C { readonly x: string }",
        },
        {
            code: "interface I { x: string }",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestAddReadonly",
                            output: "interface I { readonly x: string }",
                        },
                    ],
                },
            ],
            output: "interface I { readonly x: string }",
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
