import rule from "../../src/rules/typescript-no-redundant-undefined-optional";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("typescript-no-redundant-undefined-optional", rule, {
    invalid: [
        {
            code: "function f(value?: string | undefined) {}",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRemoveRedundantUndefined",
                            output: "function f(value?: string) {}",
                        },
                    ],
                },
            ],
            output: "function f(value?: string) {}",
        },
        {
            code: "type Pair = [value?: string | undefined];",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRemoveRedundantUndefined",
                            output: "type Pair = [value?: string];",
                        },
                    ],
                },
            ],
            output: "type Pair = [value?: string];",
        },
        {
            code: "type Pair = [(string | undefined)?];",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRemoveRedundantUndefined",
                            output: "type Pair = [(string)?];",
                        },
                    ],
                },
            ],
            output: "type Pair = [(string)?];",
        },
    ],
    valid: [
        {
            code: "function f(value?: string) {}",
        },
        {
            code: "function f(value: string | undefined) {}",
        },
        {
            code: "type Pair = [value?: string];",
        },
        {
            code: "type Pair = [(string | number)?];",
        },
        {
            code: "interface Props { value?: string | undefined; }",
        },
    ],
});
