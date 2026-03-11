import rule from "../../src/rules/typescript-require-readonly-set-type-alias";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("typescript-require-readonly-set-type-alias", rule, {
    invalid: [
        {
            code: "type Tags = Set<string>;",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRequireReadonlySetTypeAlias",
                            output: "type Tags = ReadonlySet<string>;",
                        },
                    ],
                },
            ],
            output: "type Tags = ReadonlySet<string>;",
        },
        {
            code: "type MaybeTags = Set<string> | null;",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRequireReadonlySetTypeAlias",
                            output: "type MaybeTags = ReadonlySet<string> | null;",
                        },
                    ],
                },
            ],
            output: "type MaybeTags = ReadonlySet<string> | null;",
        },
        {
            code: "type Combined = Set<string> & { readonly kind: 'ok' };",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRequireReadonlySetTypeAlias",
                            output: "type Combined = ReadonlySet<string> & { readonly kind: 'ok' };",
                        },
                    ],
                },
            ],
            output: "type Combined = ReadonlySet<string> & { readonly kind: 'ok' };",
        },
    ],
    valid: [
        {
            code: "type Tags = ReadonlySet<string>;",
        },
        {
            code: "type MaybeTags = ReadonlySet<string> | null;",
        },
        {
            code: "type Resolver = Promise<Set<string>>;",
        },
        {
            code: "type Config = { tags: Set<string> };",
        },
    ],
});
