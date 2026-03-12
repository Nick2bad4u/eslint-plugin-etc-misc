import rule from "../../src/rules/typescript-require-readonly-array-property-type";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("typescript-require-readonly-array-property-type", rule, {
    invalid: [
        {
            code: "interface Config { values: string[]; }",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId:
                                "suggestRequireReadonlyArrayPropertyType",
                            output: "interface Config { values: readonly string[]; }",
                        },
                    ],
                },
            ],
            output: "interface Config { values: readonly string[]; }",
        },
        {
            code: "type Config = { values: Array<string> | null };",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId:
                                "suggestRequireReadonlyArrayPropertyType",
                            output: "type Config = { values: ReadonlyArray<string> | null };",
                        },
                    ],
                },
            ],
            output: "type Config = { values: ReadonlyArray<string> | null };",
        },
        {
            code: "interface API { values: [number, string] & { readonly kind: 'ok' }; }",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId:
                                "suggestRequireReadonlyArrayPropertyType",
                            output: "interface API { values: readonly [number, string] & { readonly kind: 'ok' }; }",
                        },
                    ],
                },
            ],
            output: "interface API { values: readonly [number, string] & { readonly kind: 'ok' }; }",
        },
    ],
    valid: [
        {
            code: "interface Config { values: readonly string[]; }",
        },
        {
            code: "type Config = { values: ReadonlyArray<string> | null };",
        },
        {
            code: "interface Config { values: Promise<string[]>; }",
        },
        {
            code: "type Config = { values: { nested: string[] } };",
        },
        {
            code: "class Config { values: string[]; }",
        },
    ],
});
