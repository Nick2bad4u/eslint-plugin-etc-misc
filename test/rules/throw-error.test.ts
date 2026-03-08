import rule from "../../src/rules/throw-error";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("throw-error", rule, {
    invalid: [
        {
            code: [
                "const fail = (): never => {",
                "    throw \"kaboom\";",
                "};",
            ].join("\n"),
            errors: [
                {
                    data: { usage: "Throwing" },
                    messageId: "forbidden",
                },
            ],
        },
        {
            code: "const result = Promise.reject(\"kaboom\");",
            errors: [
                {
                    data: { usage: "Rejecting with" },
                    messageId: "forbidden",
                },
            ],
        },
        {
            code: "const result = new Promise((resolve, reject) => reject(\"kaboom\"));",
            errors: [
                {
                    data: { usage: "Rejecting with" },
                    messageId: "forbidden",
                },
            ],
        },
    ],
    valid: [
        {
            code: "const fail = (): never => { throw new Error(\"kaboom\"); };",
        },
        {
            code: "const fail = (): never => { throw new DOMException(\"kaboom\"); };",
        },
        {
            code: [
                "class CustomError extends Error {}",
                "const fail = (): never => {",
                "    throw new CustomError(\"kaboom\");",
                "};",
            ].join("\n"),
        },
        {
            code: "const result = Promise.reject(new Error(\"kaboom\"));",
        },
        {
            code: "const result = new Promise((resolve, reject) => reject(new Error(\"kaboom\")));",
        },
        {
            code: [
                "try {",
                "    throw new Error(\"kaboom\");",
                "} catch (error: unknown) {",
                "    throw error;",
                "}",
            ].join("\n"),
        },
        {
            code: [
                "const logger = {",
                "    reject(value: string) {",
                "        return value;",
                "    },",
                "};",
                "logger.reject(\"kaboom\");",
            ].join("\n"),
        },
    ],
});
