import rule from "../../src/rules/typescript-no-redundant-undefined-var";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("typescript-no-redundant-undefined-var", rule, {
    invalid: [
        {
            code: 'var value: string | undefined = "x"; console.log(value);',
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRemoveRedundantUndefined",
                            output: 'var value: string = "x"; console.log(value);',
                        },
                    ],
                },
            ],
            output: 'var value: string = "x"; console.log(value);',
        },
        {
            code: "var count: number | undefined = 1 as const;",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRemoveRedundantUndefined",
                            output: "var count: number = 1 as const;",
                        },
                    ],
                },
            ],
            output: "var count: number = 1 as const;",
        },
        {
            code: "var config: { enabled: boolean } | undefined = { enabled: true };",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRemoveRedundantUndefined",
                            output: "var config: { enabled: boolean } = { enabled: true };",
                        },
                    ],
                },
            ],
            output: "var config: { enabled: boolean } = { enabled: true };",
        },
    ],
    valid: [
        {
            code: 'var value: string = "x";',
        },
        {
            code: 'var value: string | undefined = "x"; value = "y";',
        },
        {
            code: "const maybe = undefined as string | undefined; var value: string | undefined = maybe;",
        },
        {
            code: "var value: string | undefined; value = 'x';",
        },
        {
            code: 'let value: string | undefined = "x";',
        },
    ],
});
