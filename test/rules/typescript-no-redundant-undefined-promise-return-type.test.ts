import rule from "../../src/rules/typescript-no-redundant-undefined-promise-return-type";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("typescript-no-redundant-undefined-promise-return-type", rule, {
    invalid: [
        {
            code: 'async function read(): Promise<string | undefined> { return "x"; }',
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRemoveRedundantUndefined",
                            output: 'async function read(): Promise<string> { return "x"; }',
                        },
                    ],
                },
            ],
            output: 'async function read(): Promise<string> { return "x"; }',
        },
        {
            code: "const read = async (): Promise<number | undefined> => 1;",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRemoveRedundantUndefined",
                            output: "const read = async (): Promise<number> => 1;",
                        },
                    ],
                },
            ],
            output: "const read = async (): Promise<number> => 1;",
        },
        {
            code: "const maybe: string | undefined = undefined; const read = async (): Promise<string | undefined> => maybe ?? 'fallback';",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRemoveRedundantUndefined",
                            output: "const maybe: string | undefined = undefined; const read = async (): Promise<string> => maybe ?? 'fallback';",
                        },
                    ],
                },
            ],
            output: "const maybe: string | undefined = undefined; const read = async (): Promise<string> => maybe ?? 'fallback';",
        },
        {
            code: "class Box { async label(): Promise<string | undefined> { return 'box'; } }",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRemoveRedundantUndefined",
                            output: "class Box { async label(): Promise<string> { return 'box'; } }",
                        },
                    ],
                },
            ],
            output: "class Box { async label(): Promise<string> { return 'box'; } }",
        },
    ],
    valid: [
        {
            code: "async function read(): Promise<string> { return 'x'; }",
        },
        {
            code: "function read(): Promise<string | undefined> { return maybe(); }",
        },
        {
            code: "async function read(): Promise<string | undefined> { return maybe(); }",
        },
        {
            code: "async function read(): Promise<string | undefined> { const value = 'x'; return value; }",
        },
        {
            code: "const read = async (): Promise<undefined> => undefined;",
        },
        {
            code: "const read = async (): Promise<string | null> => 'x';",
        },
    ],
});
