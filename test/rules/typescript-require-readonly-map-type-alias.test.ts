import rule from "../../src/rules/typescript-require-readonly-map-type-alias";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("typescript-require-readonly-map-type-alias", rule, {
    invalid: [
        {
            code: "type Lookup = Map<string, number>;",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRequireReadonlyMapTypeAlias",
                            output: "type Lookup = ReadonlyMap<string, number>;",
                        },
                    ],
                },
            ],
            output: "type Lookup = ReadonlyMap<string, number>;",
        },
        {
            code: "type MaybeLookup = Map<string, number> | null;",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRequireReadonlyMapTypeAlias",
                            output: "type MaybeLookup = ReadonlyMap<string, number> | null;",
                        },
                    ],
                },
            ],
            output: "type MaybeLookup = ReadonlyMap<string, number> | null;",
        },
        {
            code: "type Combined = Map<string, number> & { readonly kind: 'ok' };",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRequireReadonlyMapTypeAlias",
                            output: "type Combined = ReadonlyMap<string, number> & { readonly kind: 'ok' };",
                        },
                    ],
                },
            ],
            output: "type Combined = ReadonlyMap<string, number> & { readonly kind: 'ok' };",
        },
    ],
    valid: [
        {
            code: "type Lookup = ReadonlyMap<string, number>;",
        },
        {
            code: "type MaybeLookup = ReadonlyMap<string, number> | null;",
        },
        {
            code: "type Resolver = Promise<Map<string, number>>;",
        },
        {
            code: "type Config = { lookup: Map<string, number> };",
        },
    ],
});
