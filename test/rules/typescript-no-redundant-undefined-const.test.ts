import rule from "../../src/rules/typescript-no-redundant-undefined-const";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("typescript-no-redundant-undefined-const", rule, {
    invalid: [
        {
            code: 'const value: string | undefined = "x";',
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRemoveRedundantUndefined",
                            output: 'const value: string = "x";',
                        },
                    ],
                },
            ],
            output: 'const value: string = "x";',
        },
        {
            code: "const value: number | undefined = 1 as const;",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRemoveRedundantUndefined",
                            output: "const value: number = 1 as const;",
                        },
                    ],
                },
            ],
            output: "const value: number = 1 as const;",
        },
        {
            code: 'const { value }: { value: string } | undefined = { value: "x" };',
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRemoveRedundantUndefined",
                            output: 'const { value }: { value: string } = { value: "x" };',
                        },
                    ],
                },
            ],
            output: 'const { value }: { value: string } = { value: "x" };',
        },
    ],
    valid: [
        {
            code: 'const value: string = "x";',
        },
        {
            code: "const maybe = Math.random() > 0.5 ? 'x' : undefined; const value: string | undefined = maybe;",
        },
        {
            code: "const value: string | undefined = undefined;",
        },
        {
            code: 'let value: string | undefined = "x";',
        },
        {
            code: 'const value: undefined = "x";',
        },
    ],
});
