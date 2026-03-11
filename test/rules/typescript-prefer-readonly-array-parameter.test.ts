import rule from "../../src/rules/typescript-prefer-readonly-array-parameter";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("typescript-prefer-readonly-array-parameter", rule, {
    invalid: [
        {
            code: "function f(values: string[]) {}",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestPreferReadonlyArrayParameter",
                            output: "function f(values: readonly string[]) {}",
                        },
                    ],
                },
            ],
            output: "function f(values: readonly string[]) {}",
        },
        {
            code: "const f = (values: Array<string>) => values.length;",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestPreferReadonlyArrayParameter",
                            output: "const f = (values: ReadonlyArray<string>) => values.length;",
                        },
                    ],
                },
            ],
            output: "const f = (values: ReadonlyArray<string>) => values.length;",
        },
        {
            code: "const f = (pair: [string, number]) => pair[0];",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestPreferReadonlyArrayParameter",
                            output: "const f = (pair: readonly [string, number]) => pair[0];",
                        },
                    ],
                },
            ],
            output: "const f = (pair: readonly [string, number]) => pair[0];",
        },
        {
            code: "function f(values: string[] | null) { return values; }",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestPreferReadonlyArrayParameter",
                            output: "function f(values: readonly string[] | null) { return values; }",
                        },
                    ],
                },
            ],
            output: "function f(values: readonly string[] | null) { return values; }",
        },
        {
            code: "class A { constructor(private values: string[]) {} }",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestPreferReadonlyArrayParameter",
                            output: "class A { constructor(private values: readonly string[]) {} }",
                        },
                    ],
                },
            ],
            output: "class A { constructor(private values: readonly string[]) {} }",
        },
        {
            code: "function f(...values: string[]) { return values; }",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestPreferReadonlyArrayParameter",
                            output: "function f(...values: readonly string[]) { return values; }",
                        },
                    ],
                },
            ],
            output: "function f(...values: readonly string[]) { return values; }",
        },
    ],
    valid: [
        {
            code: "function f(values: readonly string[]) {}",
        },
        {
            code: "function f(values: ReadonlyArray<string>) {}",
        },
        {
            code: "function f(pair: readonly [string, number]) {}",
        },
        {
            code: "function f(values: readonly string[] | null) {}",
        },
        {
            code: "function f(options: { values: string[] }) {}",
        },
    ],
});
