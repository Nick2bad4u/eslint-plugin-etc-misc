import rule from "../../src/rules/typescript-require-readonly-set-parameter-type";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("typescript-require-readonly-set-parameter-type", rule, {
    invalid: [
        {
            code: "function loadTags(tags: Set<string>) {}",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRequireReadonlySetParameterType",
                            output: "function loadTags(tags: ReadonlySet<string>) {}",
                        },
                    ],
                },
            ],
            output: "function loadTags(tags: ReadonlySet<string>) {}",
        },
        {
            code: "const get = (tags: Set<string> | null) => tags;",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRequireReadonlySetParameterType",
                            output: "const get = (tags: ReadonlySet<string> | null) => tags;",
                        },
                    ],
                },
            ],
            output: "const get = (tags: ReadonlySet<string> | null) => tags;",
        },
        {
            code: "class Registry { constructor(private readonly tags: Set<string>) {} }",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRequireReadonlySetParameterType",
                            output: "class Registry { constructor(private readonly tags: ReadonlySet<string>) {} }",
                        },
                    ],
                },
            ],
            output: "class Registry { constructor(private readonly tags: ReadonlySet<string>) {} }",
        },
        {
            code: "interface API { resolve(values: Set<string> & { readonly kind: 'ok' }): void; }",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRequireReadonlySetParameterType",
                            output: "interface API { resolve(values: ReadonlySet<string> & { readonly kind: 'ok' }): void; }",
                        },
                    ],
                },
            ],
            output: "interface API { resolve(values: ReadonlySet<string> & { readonly kind: 'ok' }): void; }",
        },
    ],
    valid: [
        {
            code: "function loadTags(tags: ReadonlySet<string>) {}",
        },
        {
            code: "const get = (tags: ReadonlySet<string> | null) => tags;",
        },
        {
            code: "function configure(settings: { tags: Set<string> }) {}",
        },
        { code: "function configure(tags?: ReadonlySet<string>) {}" },
    ],
});
