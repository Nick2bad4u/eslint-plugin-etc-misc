import rule from "../../src/rules/typescript-no-redundant-undefined-default-parameter";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("typescript-no-redundant-undefined-default-parameter", rule, {
    invalid: [
        {
            code: 'function f(value: string | undefined = "x") {}',
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRemoveRedundantUndefined",
                            output: 'function f(value: string = "x") {}',
                        },
                    ],
                },
            ],
            output: 'function f(value: string = "x") {}',
        },
        {
            code: "const f = (value: number | undefined = 1) => value;",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRemoveRedundantUndefined",
                            output: "const f = (value: number = 1) => value;",
                        },
                    ],
                },
            ],
            output: "const f = (value: number = 1) => value;",
        },
        {
            code: 'class Box { constructor(private value: string | undefined = "x") {} }',
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRemoveRedundantUndefined",
                            output: 'class Box { constructor(private value: string = "x") {} }',
                        },
                    ],
                },
            ],
            output: 'class Box { constructor(private value: string = "x") {} }',
        },
        {
            code: 'function f({ value }: { value: string } | undefined = { value: "x" }) {}',
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRemoveRedundantUndefined",
                            output: 'function f({ value }: { value: string } = { value: "x" }) {}',
                        },
                    ],
                },
            ],
            output: 'function f({ value }: { value: string } = { value: "x" }) {}',
        },
    ],
    valid: [
        {
            code: 'function f(value: string = "x") {}',
        },
        {
            code: "const maybe = undefined as string | undefined; function f(value: string | undefined = maybe) {}",
        },
        {
            code: "function f(value: string | undefined = undefined) {}",
        },
        {
            code: "function f(value?: string | undefined) {}",
        },
        {
            code: 'function f(value: undefined = "x") {}',
        },
    ],
});
