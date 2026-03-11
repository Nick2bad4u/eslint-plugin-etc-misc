import rule from "../../src/rules/typescript-require-readonly-map-parameter-type";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("typescript-require-readonly-map-parameter-type", rule, {
    invalid: [
        {
            code: "function loadIndex(index: Map<string, number>) {}",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRequireReadonlyMapParameterType",
                            output: "function loadIndex(index: ReadonlyMap<string, number>) {}",
                        },
                    ],
                },
            ],
            output: "function loadIndex(index: ReadonlyMap<string, number>) {}",
        },
        {
            code: "const get = (index: Map<string, number> | null) => index;",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRequireReadonlyMapParameterType",
                            output: "const get = (index: ReadonlyMap<string, number> | null) => index;",
                        },
                    ],
                },
            ],
            output: "const get = (index: ReadonlyMap<string, number> | null) => index;",
        },
        {
            code: "class Registry { constructor(private readonly table: Map<string, string>) {} }",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRequireReadonlyMapParameterType",
                            output: "class Registry { constructor(private readonly table: ReadonlyMap<string, string>) {} }",
                        },
                    ],
                },
            ],
            output: "class Registry { constructor(private readonly table: ReadonlyMap<string, string>) {} }",
        },
        {
            code: "interface API { resolve(values: Map<string, string> & { readonly kind: 'ok' }): void; }",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRequireReadonlyMapParameterType",
                            output: "interface API { resolve(values: ReadonlyMap<string, string> & { readonly kind: 'ok' }): void; }",
                        },
                    ],
                },
            ],
            output: "interface API { resolve(values: ReadonlyMap<string, string> & { readonly kind: 'ok' }): void; }",
        },
    ],
    valid: [
        {
            code: "function loadIndex(index: ReadonlyMap<string, number>) {}",
        },
        {
            code: "const get = (index: ReadonlyMap<string, number> | null) => index;",
        },
        {
            code: "function configure(settings: { index: Map<string, number> }) {}",
        },
        { code: "function configure(index?: ReadonlyMap<string, number>) {}" },
    ],
});
