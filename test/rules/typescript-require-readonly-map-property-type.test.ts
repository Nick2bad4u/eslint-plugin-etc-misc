import rule from "../../src/rules/typescript-require-readonly-map-property-type";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("typescript-require-readonly-map-property-type", rule, {
    invalid: [
        {
            code: "interface Config { lookup: Map<string, number>; }",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRequireReadonlyMapPropertyType",
                            output: "interface Config { lookup: ReadonlyMap<string, number>; }",
                        },
                    ],
                },
            ],
            output: "interface Config { lookup: ReadonlyMap<string, number>; }",
        },
        {
            code: "type Config = { lookup: Map<string, number> | null };",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRequireReadonlyMapPropertyType",
                            output: "type Config = { lookup: ReadonlyMap<string, number> | null };",
                        },
                    ],
                },
            ],
            output: "type Config = { lookup: ReadonlyMap<string, number> | null };",
        },
        {
            code: "interface API { lookup: Map<string, number> & { readonly kind: 'ok' }; }",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRequireReadonlyMapPropertyType",
                            output: "interface API { lookup: ReadonlyMap<string, number> & { readonly kind: 'ok' }; }",
                        },
                    ],
                },
            ],
            output: "interface API { lookup: ReadonlyMap<string, number> & { readonly kind: 'ok' }; }",
        },
    ],
    valid: [
        {
            code: "interface Config { lookup: ReadonlyMap<string, number>; }",
        },
        {
            code: "type Config = { lookup: ReadonlyMap<string, number> | null };",
        },
        {
            code: "interface Config { lookup: Promise<Map<string, number>>; }",
        },
        {
            code: "type Config = { lookup: { nested: Map<string, number> } };",
        },
        {
            code: "class Config { lookup: Map<string, number>; }",
        },
    ],
});
