import rule from "../../src/rules/typescript-require-readonly-array-type-alias";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("typescript-require-readonly-array-type-alias", rule, {
    invalid: [
        {
            code: "type Names = string[];",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRequireReadonlyArrayTypeAlias",
                            output: "type Names = readonly string[];",
                        },
                    ],
                },
            ],
            output: "type Names = readonly string[];",
        },
        {
            code: "type Names = Array<string>;",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRequireReadonlyArrayTypeAlias",
                            output: "type Names = ReadonlyArray<string>;",
                        },
                    ],
                },
            ],
            output: "type Names = ReadonlyArray<string>;",
        },
        {
            code: "type Pair = [string, number];",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRequireReadonlyArrayTypeAlias",
                            output: "type Pair = readonly [string, number];",
                        },
                    ],
                },
            ],
            output: "type Pair = readonly [string, number];",
        },
        {
            code: "type MaybeNames = string[] | null;",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRequireReadonlyArrayTypeAlias",
                            output: "type MaybeNames = readonly string[] | null;",
                        },
                    ],
                },
            ],
            output: "type MaybeNames = readonly string[] | null;",
        },
        {
            code: "type Merged = string[] & { readonly kind: 'ok' };",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRequireReadonlyArrayTypeAlias",
                            output: "type Merged = readonly string[] & { readonly kind: 'ok' };",
                        },
                    ],
                },
            ],
            output: "type Merged = readonly string[] & { readonly kind: 'ok' };",
        },
    ],
    valid: [
        {
            code: "type Names = readonly string[];",
        },
        {
            code: "type Names = ReadonlyArray<string>;",
        },
        {
            code: "type Pair = readonly [string, number];",
        },
        {
            code: "type MaybeNames = readonly string[] | null;",
        },
        {
            code: "type APIResponse = { values: string[] };",
        },
    ],
});
