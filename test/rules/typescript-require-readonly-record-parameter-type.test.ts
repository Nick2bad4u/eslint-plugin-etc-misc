import rule from "../../src/rules/typescript-require-readonly-record-parameter-type";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("typescript-require-readonly-record-parameter-type", rule, {
    invalid: [
        {
            code: "function loadLookup(lookup: Record<string, string>) {}",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId:
                                "suggestRequireReadonlyRecordParameterType",
                            output: "function loadLookup(lookup: Readonly<Record<string, string>>) {}",
                        },
                    ],
                },
            ],
            output: "function loadLookup(lookup: Readonly<Record<string, string>>) {}",
        },
        {
            code: "const resolve = (lookup: Record<string, string> | null) => lookup;",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId:
                                "suggestRequireReadonlyRecordParameterType",
                            output: "const resolve = (lookup: Readonly<Record<string, string>> | null) => lookup;",
                        },
                    ],
                },
            ],
            output: "const resolve = (lookup: Readonly<Record<string, string>> | null) => lookup;",
        },
        {
            code: "class Registry { constructor(private readonly lookup: Record<string, string>) {} }",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId:
                                "suggestRequireReadonlyRecordParameterType",
                            output: "class Registry { constructor(private readonly lookup: Readonly<Record<string, string>>) {} }",
                        },
                    ],
                },
            ],
            output: "class Registry { constructor(private readonly lookup: Readonly<Record<string, string>>) {} }",
        },
        {
            code: "interface API { resolve(lookup: Record<string, string> & { readonly kind: 'ok' }): void; }",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId:
                                "suggestRequireReadonlyRecordParameterType",
                            output: "interface API { resolve(lookup: Readonly<Record<string, string>> & { readonly kind: 'ok' }): void; }",
                        },
                    ],
                },
            ],
            output: "interface API { resolve(lookup: Readonly<Record<string, string>> & { readonly kind: 'ok' }): void; }",
        },
    ],
    valid: [
        {
            code: "function loadLookup(lookup: Readonly<Record<string, string>>) {}",
        },
        {
            code: "const resolve = (lookup: Readonly<Record<string, string>> | null) => lookup;",
        },
        {
            code: "function configure(settings: { lookup: Record<string, string> }) {}",
        },
        {
            code: "function configure(lookup?: Readonly<Record<string, string>>) {}",
        },
    ],
});
