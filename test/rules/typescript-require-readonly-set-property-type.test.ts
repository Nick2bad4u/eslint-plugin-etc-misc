import rule from "../../src/rules/typescript-require-readonly-set-property-type";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("typescript-require-readonly-set-property-type", rule, {
    invalid: [
        {
            code: "interface Config { values: Set<string>; }",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRequireReadonlySetPropertyType",
                            output: "interface Config { values: ReadonlySet<string>; }",
                        },
                    ],
                },
            ],
            output: "interface Config { values: ReadonlySet<string>; }",
        },
        {
            code: "type Config = { values: Set<string> | null };",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRequireReadonlySetPropertyType",
                            output: "type Config = { values: ReadonlySet<string> | null };",
                        },
                    ],
                },
            ],
            output: "type Config = { values: ReadonlySet<string> | null };",
        },
        {
            code: "interface API { values: Set<string> & { readonly kind: 'ok' }; }",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRequireReadonlySetPropertyType",
                            output: "interface API { values: ReadonlySet<string> & { readonly kind: 'ok' }; }",
                        },
                    ],
                },
            ],
            output: "interface API { values: ReadonlySet<string> & { readonly kind: 'ok' }; }",
        },
    ],
    valid: [
        {
            code: "interface Config { values: ReadonlySet<string>; }",
        },
        {
            code: "type Config = { values: ReadonlySet<string> | null };",
        },
        {
            code: "interface Config { values: Promise<Set<string>>; }",
        },
        {
            code: "type Config = { values: { nested: Set<string> } };",
        },
        {
            code: "class Config { values: Set<string>; }",
        },
    ],
});
