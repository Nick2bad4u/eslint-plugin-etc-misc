import rule from "../../src/rules/no-const-enum";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("no-const-enum", rule, {
    invalid: [
        {
            code: "const enum Numbers { one = 1 }",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRemoveConst",
                            output: "enum Numbers { one = 1 }",
                        },
                    ],
                },
            ],
            output: "enum Numbers { one = 1 }",
        },
        {
            code: "export const enum Numbers { one = 1 }",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRemoveConst",
                            output: "export enum Numbers { one = 1 }",
                        },
                    ],
                },
            ],
            options: [{ allowLocal: true }],
            output: "export enum Numbers { one = 1 }",
        },
    ],
    valid: [
        {
            code: "enum Numbers { one = 1 }",
        },
        {
            code: "const enum Numbers { one = 1 }",
            options: [{ allowLocal: true }],
        },
    ],
});
