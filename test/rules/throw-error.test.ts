import plugin from "../../src/plugin";
import { ruleTester } from "../_internal/ruleTester";

const getThrowErrorRuleFromPlugin = (): NonNullable<
    (typeof plugin.rules)["throw-error"]
> => {
    const ruleModule = plugin.rules["throw-error"];

    if (ruleModule === undefined) {
        throw new TypeError(
            "Rule 'throw-error' was not found in plugin export."
        );
    }

    return ruleModule;
};

ruleTester.run("throw-error", getThrowErrorRuleFromPlugin(), {
    invalid: [
        {
            code: [
                "const fail = (): never => {",
                '    throw "kaboom";',
                "};",
            ].join("\n"),
            errors: [
                {
                    data: { usage: "Throwing" },
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestWrapInError",
                            output: [
                                "const fail = (): never => {",
                                '    throw new Error("kaboom");',
                                "};",
                            ].join("\n"),
                        },
                    ],
                },
            ],
        },
        {
            code: 'const result = Promise.reject("kaboom");',
            errors: [
                {
                    data: { usage: "Rejecting with" },
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestWrapInError",
                            output: 'const result = Promise.reject(new Error("kaboom"));',
                        },
                    ],
                },
            ],
        },
        {
            code: 'const result = new Promise((resolve, reject) => reject("kaboom"));',
            errors: [
                {
                    data: { usage: "Rejecting with" },
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestWrapInError",
                            output: 'const result = new Promise((resolve, reject) => reject(new Error("kaboom")));',
                        },
                    ],
                },
            ],
        },
        {
            code: [
                "const result = new Promise(function (resolve, reject) {",
                '    reject("kaboom");',
                "});",
            ].join("\n"),
            errors: [
                {
                    data: { usage: "Rejecting with" },
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestWrapInError",
                            output: [
                                "const result = new Promise(function (resolve, reject) {",
                                '    reject(new Error("kaboom"));',
                                "});",
                            ].join("\n"),
                        },
                    ],
                },
            ],
        },
        {
            code: [
                "const shouldThrow = (value: string | number): never => {",
                "    if (typeof value === 'string') {",
                "        throw value;",
                "    }",
                "",
                "    throw value;",
                "};",
            ].join("\n"),
            errors: [
                {
                    data: { usage: "Throwing" },
                    messageId: "forbidden",
                },
                {
                    data: { usage: "Throwing" },
                    messageId: "forbidden",
                },
            ],
        },
        {
            code: [
                "const shouldThrow = (value: Error | string): never => {",
                "    throw value;",
                "};",
            ].join("\n"),
            errors: [
                {
                    data: { usage: "Throwing" },
                    messageId: "forbidden",
                },
            ],
        },
    ],
    valid: [
        {
            code: 'const fail = (): never => { throw new Error("kaboom"); };',
        },
        {
            code: 'const fail = (): never => { throw new DOMException("kaboom"); };',
        },
        {
            code: [
                "class CustomError extends Error {}",
                "const fail = (): never => {",
                '    throw new CustomError("kaboom");',
                "};",
            ].join("\n"),
        },
        {
            code: 'const result = Promise.reject(new Error("kaboom"));',
        },
        {
            code: "const result = Promise.reject();",
        },
        {
            code: 'const result = new Promise((resolve, reject) => reject(new Error("kaboom")));',
        },
        {
            code: [
                "const result = new Promise((resolve, ...restReject) => {",
                "    void resolve;",
                "    void restReject;",
                "});",
                "",
                "void result;",
            ].join("\n"),
        },
        {
            code: [
                "const result = new Promise((resolve, reject) => {",
                "    const alias = reject;",
                '    alias("kaboom");',
                "});",
            ].join("\n"),
        },
        {
            code: [
                "class BaseClass {",
                "    reject(value: unknown): void {",
                "        void value;",
                "    }",
                "}",
                "",
                "class ChildClass extends BaseClass {",
                "    run(): void {",
                '        super.reject("kaboom");',
                "    }",
                "}",
            ].join("\n"),
        },
        {
            code: [
                "try {",
                '    throw new Error("kaboom");',
                "} catch (error: unknown) {",
                "    throw error;",
                "}",
            ].join("\n"),
        },
        {
            code: [
                "const throwMaybeError = (value: Error | DOMException): never => {",
                "    throw value;",
                "};",
            ].join("\n"),
        },
        {
            code: [
                "const logger = {",
                "    reject(value: string) {",
                "        return value;",
                "    },",
                "};",
                'logger.reject("kaboom");',
            ].join("\n"),
        },
    ],
});
