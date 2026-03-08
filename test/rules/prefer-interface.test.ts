import rule from "../../src/rules/prefer-interface";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("prefer-interface", rule, {
    invalid: [
        {
            code: "type T = { length: number; };",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggest",
                            output: "interface T { length: number; }",
                        },
                    ],
                },
            ],
            output: "interface T { length: number; }",
        },
        {
            code: "type T = (value: string) => string;",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggest",
                            output: "interface T { (value: string): string; }",
                        },
                    ],
                },
            ],
            output: "interface T { (value: string): string; }",
        },
        {
            code: "type Func<Foo> = <Bar>(foo: Foo) => Bar;",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggest",
                            output: "interface Func<Foo> { <Bar>(foo: Foo): Bar; }",
                        },
                    ],
                },
            ],
            output: "interface Func<Foo> { <Bar>(foo: Foo): Bar; }",
        },
        {
            code: "export type Exported = { value: number; };",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggest",
                            output:
                                "export interface Exported { value: number; }",
                        },
                    ],
                },
            ],
            options: [{ allowLocal: true }],
            output: "export interface Exported { value: number; }",
        },
        {
            code: [
                "interface Name { name: string; }",
                "interface Age { age: number; }",
                "type T = Name & Age;",
            ].join("\n"),
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggest",
                            output: [
                                "interface Name { name: string; }",
                                "interface Age { age: number; }",
                                "interface T extends Name, Age {}",
                            ].join("\n"),
                        },
                    ],
                },
            ],
            options: [{ allowIntersection: false }],
            output: [
                "interface Name { name: string; }",
                "interface Age { age: number; }",
                "interface T extends Name, Age {}",
            ].join("\n"),
        },
        {
            code: [
                "interface Name { name: string; }",
                "type T = Name & { age: number; };",
            ].join("\n"),
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggest",
                            output: [
                                "interface Name { name: string; }",
                                "interface T extends Name { age: number; }",
                            ].join("\n"),
                        },
                    ],
                },
            ],
            options: [{ allowIntersection: false }],
            output: [
                "interface Name { name: string; }",
                "interface T extends Name { age: number; }",
            ].join("\n"),
        },
    ],
    valid: [
        {
            code: "type T = string | number;",
        },
        {
            code: "type T = { length: number; };",
            options: [{ allowLocal: true }],
        },
        {
            code: "type Pair = { left: number; } & { right: number; };",
        },
        {
            code: [
                "type UserName = { name: string; } | { username: string; };",
                "type User = UserName & { id: string; };",
            ].join("\n"),
            options: [{ allowIntersection: false }],
        },
    ],
});
