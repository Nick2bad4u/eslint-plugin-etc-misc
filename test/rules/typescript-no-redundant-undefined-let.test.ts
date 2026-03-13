import rule from "../../src/rules/typescript-no-redundant-undefined-let";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("typescript-no-redundant-undefined-let", rule, {
    invalid: [
        {
            code: 'let value: string | undefined = "x"; console.log(value);',
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRemoveRedundantUndefined",
                            output: 'let value: string = "x"; console.log(value);',
                        },
                    ],
                },
            ],
            output: 'let value: string = "x"; console.log(value);',
        },
        {
            code: "let count: number | undefined = 1 as const;",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRemoveRedundantUndefined",
                            output: "let count: number = 1 as const;",
                        },
                    ],
                },
            ],
            output: "let count: number = 1 as const;",
        },
        {
            code: "let config: { enabled: boolean } | undefined = { enabled: true };",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRemoveRedundantUndefined",
                            output: "let config: { enabled: boolean } = { enabled: true };",
                        },
                    ],
                },
            ],
            output: "let config: { enabled: boolean } = { enabled: true };",
        },
    ],
    valid: [
        {
            code: 'let value: string = "x";',
        },
        {
            code: 'let value: string | undefined = "x"; value = "y";',
        },
        {
            code: "const maybe = undefined as string | undefined; let value: string | undefined = maybe;",
        },
        {
            code: "let value: string | undefined; value = 'x';",
        },
        {
            code: 'const value: string | undefined = "x";',
        },
    ],
});
