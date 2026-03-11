import rule from "../../src/rules/typescript-require-readonly-record-property-type";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("typescript-require-readonly-record-property-type", rule, {
    invalid: [
        {
            code: "interface Config { lookup: Record<string, number>; }",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId:
                                "suggestRequireReadonlyRecordPropertyType",
                            output: "interface Config { lookup: Readonly<Record<string, number>>; }",
                        },
                    ],
                },
            ],
            output: "interface Config { lookup: Readonly<Record<string, number>>; }",
        },
        {
            code: "type Config = { lookup: Record<string, number> | null };",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId:
                                "suggestRequireReadonlyRecordPropertyType",
                            output: "type Config = { lookup: Readonly<Record<string, number>> | null };",
                        },
                    ],
                },
            ],
            output: "type Config = { lookup: Readonly<Record<string, number>> | null };",
        },
        {
            code: "interface API { lookup: Record<string, number> & { readonly kind: 'ok' }; }",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId:
                                "suggestRequireReadonlyRecordPropertyType",
                            output: "interface API { lookup: Readonly<Record<string, number>> & { readonly kind: 'ok' }; }",
                        },
                    ],
                },
            ],
            output: "interface API { lookup: Readonly<Record<string, number>> & { readonly kind: 'ok' }; }",
        },
    ],
    valid: [
        {
            code: "interface Config { lookup: Readonly<Record<string, number>>; }",
        },
        {
            code: "type Config = { lookup: Readonly<Record<string, number>> | null };",
        },
        {
            code: "interface Config { lookup: Promise<Record<string, number>>; }",
        },
        {
            code: "type Config = { lookup: { nested: Record<string, number> } };",
        },
    ],
});
