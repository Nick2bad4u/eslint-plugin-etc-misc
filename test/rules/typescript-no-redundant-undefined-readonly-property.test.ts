import rule from "../../src/rules/typescript-no-redundant-undefined-readonly-property";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("typescript-no-redundant-undefined-readonly-property", rule, {
    invalid: [
        {
            code: 'class Box { readonly value: string | undefined = "x"; }',
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRemoveRedundantUndefined",
                            output: 'class Box { readonly value: string = "x"; }',
                        },
                    ],
                },
            ],
            output: 'class Box { readonly value: string = "x"; }',
        },
        {
            code: "class Box { static readonly count: number | undefined = 0 as const; }",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRemoveRedundantUndefined",
                            output: "class Box { static readonly count: number = 0 as const; }",
                        },
                    ],
                },
            ],
            output: "class Box { static readonly count: number = 0 as const; }",
        },
        {
            code: "class Box { readonly config: { enabled: boolean } | undefined = { enabled: true }; }",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRemoveRedundantUndefined",
                            output: "class Box { readonly config: { enabled: boolean } = { enabled: true }; }",
                        },
                    ],
                },
            ],
            output: "class Box { readonly config: { enabled: boolean } = { enabled: true }; }",
        },
    ],
    valid: [
        {
            code: 'class Box { readonly value: string = "x"; }',
        },
        {
            code: "const maybe = undefined as string | undefined; class Box { readonly value: string | undefined = maybe; }",
        },
        {
            code: "class Box { readonly value: string | undefined = undefined; }",
        },
        {
            code: 'class Box { value: string | undefined = "x"; }',
        },
        {
            code: 'class Box { readonly value?: string | undefined = "x"; }',
        },
        {
            code: "class Box { declare readonly value: string | undefined; }",
        },
    ],
});
