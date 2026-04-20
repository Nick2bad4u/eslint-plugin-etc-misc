import rule from "../../src/rules/no-misused-generics";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("no-misused-generics", rule, {
    invalid: [
        {
            code: "declare function get<T>(): T;",
            errors: [
                {
                    data: { name: "T" },
                    messageId: "cannotInfer",
                },
            ],
        },
        {
            code: "declare function take<T>(value: T): void;",
            errors: [
                {
                    data: {
                        name: "T",
                        replacement: "unknown",
                    },
                    messageId: "canReplace",
                },
            ],
        },
        {
            code: "declare function take<T extends object>(value: T): void;",
            errors: [
                {
                    data: {
                        name: "T",
                        replacement: "object",
                    },
                    messageId: "canReplace",
                },
            ],
        },
        {
            code: "declare function project<T, U extends T>(value: T): U;",
            errors: [
                {
                    data: { name: "U" },
                    messageId: "cannotInfer",
                },
            ],
        },
        {
            code: "function fn<T>(value: string): T { throw new Error(value); }",
            errors: [
                {
                    data: { name: "T" },
                    messageId: "cannotInfer",
                },
            ],
        },
    ],
    valid: [
        {
            code: "declare function identity<T>(value: T): T;",
        },
        {
            code: "function log(value: string): void { console.log(value); }",
        },
        {
            code: "declare function compare<T>(left: T, right: T): boolean;",
        },
        {
            code: "declare function compare<T, U extends T>(left: T, right: U): boolean;",
        },
        {
            code: "function store<K, V>(map: Map<K, V>, key: K, value: V): void { map.set(key, value); }",
        },
    ],
});
