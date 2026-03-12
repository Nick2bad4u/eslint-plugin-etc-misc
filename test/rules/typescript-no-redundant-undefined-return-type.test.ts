import rule from "../../src/rules/typescript-no-redundant-undefined-return-type";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("typescript-no-redundant-undefined-return-type", rule, {
    invalid: [
        {
            code: 'const read = (): string | undefined => "x";',
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRemoveRedundantUndefined",
                            output: 'const read = (): string => "x";',
                        },
                    ],
                },
            ],
            output: 'const read = (): string => "x";',
        },
        {
            code: "function count(): number | undefined { return 1; }",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRemoveRedundantUndefined",
                            output: "function count(): number { return 1; }",
                        },
                    ],
                },
            ],
            output: "function count(): number { return 1; }",
        },
        {
            code: "const pick = (flag: boolean): string | undefined => (flag ? 'a' : 'b');",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRemoveRedundantUndefined",
                            output: "const pick = (flag: boolean): string => (flag ? 'a' : 'b');",
                        },
                    ],
                },
            ],
            output: "const pick = (flag: boolean): string => (flag ? 'a' : 'b');",
        },
        {
            code: "const maybe: string | undefined = undefined; const read = (): string | undefined => maybe ?? 'fallback';",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRemoveRedundantUndefined",
                            output: "const maybe: string | undefined = undefined; const read = (): string => maybe ?? 'fallback';",
                        },
                    ],
                },
            ],
            output: "const maybe: string | undefined = undefined; const read = (): string => maybe ?? 'fallback';",
        },
        {
            code: "class Box { get label(): string | undefined { return 'box'; } }",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRemoveRedundantUndefined",
                            output: "class Box { get label(): string { return 'box'; } }",
                        },
                    ],
                },
            ],
            output: "class Box { get label(): string { return 'box'; } }",
        },
    ],
    valid: [
        {
            code: "const read = (): string => 'x';",
        },
        {
            code: "const value: string | undefined = undefined; const read = (): string | undefined => value;",
        },
        {
            code: "function read(): string | undefined { const value = 'x'; return value; }",
        },
        {
            code: "function read(): string | undefined { return maybe(); }",
        },
        {
            code: "const read = (flag: boolean): string | undefined => (flag ? 'x' : undefined);",
        },
        {
            code: "const read = (): undefined => undefined;",
        },
    ],
});
