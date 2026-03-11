import rule from "../../src/rules/typescript-require-readonly-record-type-alias";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("typescript-require-readonly-record-type-alias", rule, {
    invalid: [
        {
            code: "type Lookup = Record<string, number>;",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRequireReadonlyRecordTypeAlias",
                            output: "type Lookup = Readonly<Record<string, number>>;",
                        },
                    ],
                },
            ],
            output: "type Lookup = Readonly<Record<string, number>>;",
        },
        {
            code: "type MaybeLookup = Record<string, number> | null;",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRequireReadonlyRecordTypeAlias",
                            output: "type MaybeLookup = Readonly<Record<string, number>> | null;",
                        },
                    ],
                },
            ],
            output: "type MaybeLookup = Readonly<Record<string, number>> | null;",
        },
        {
            code: "type Combined = Record<string, number> & { readonly kind: 'ok' };",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRequireReadonlyRecordTypeAlias",
                            output: "type Combined = Readonly<Record<string, number>> & { readonly kind: 'ok' };",
                        },
                    ],
                },
            ],
            output: "type Combined = Readonly<Record<string, number>> & { readonly kind: 'ok' };",
        },
    ],
    valid: [
        {
            code: "type Lookup = Readonly<Record<string, number>>;",
        },
        {
            code: "type MaybeLookup = Readonly<Record<string, number>> | null;",
        },
        {
            code: "type Resolver = Promise<Record<string, number>>;",
        },
        {
            code: "type Config = { lookup: Record<string, number> };",
        },
    ],
});
