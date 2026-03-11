import rule from "../../src/rules/typescript-require-readonly-array-return-type";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("typescript-require-readonly-array-return-type", rule, {
    invalid: [
        {
            code: "function f(): string[] { return []; }",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRequireReadonlyArrayReturnType",
                            output: "function f(): readonly string[] { return []; }",
                        },
                    ],
                },
            ],
            output: "function f(): readonly string[] { return []; }",
        },
        {
            code: "const f = (): Array<string> => [];",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRequireReadonlyArrayReturnType",
                            output: "const f = (): ReadonlyArray<string> => [];",
                        },
                    ],
                },
            ],
            output: "const f = (): ReadonlyArray<string> => [];",
        },
        {
            code: "const f = (): [string, number] => ['a', 1];",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRequireReadonlyArrayReturnType",
                            output: "const f = (): readonly [string, number] => ['a', 1];",
                        },
                    ],
                },
            ],
            output: "const f = (): readonly [string, number] => ['a', 1];",
        },
        {
            code: "type Fn = () => string[] | null;",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRequireReadonlyArrayReturnType",
                            output: "type Fn = () => readonly string[] | null;",
                        },
                    ],
                },
            ],
            output: "type Fn = () => readonly string[] | null;",
        },
        {
            code: "interface API { run(): string[]; }",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRequireReadonlyArrayReturnType",
                            output: "interface API { run(): readonly string[]; }",
                        },
                    ],
                },
            ],
            output: "interface API { run(): readonly string[]; }",
        },
        {
            code: "type Factory = new () => string[];",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRequireReadonlyArrayReturnType",
                            output: "type Factory = new () => readonly string[];",
                        },
                    ],
                },
            ],
            output: "type Factory = new () => readonly string[];",
        },
    ],
    valid: [
        {
            code: "function f(): readonly string[] { return []; }",
        },
        {
            code: "function f(): ReadonlyArray<string> { return []; }",
        },
        {
            code: "type Fn = () => readonly [string, number];",
        },
        {
            code: "type Fn = () => readonly string[] | null;",
        },
        {
            code: "function f(): { values: string[] } { return { values: [] }; }",
        },
    ],
});
