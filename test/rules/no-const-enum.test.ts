import rule from "../../src/rules/no-const-enum";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("no-const-enum", rule, {
    invalid: [
        {
            code: "const enum Numbers { one = 1 }",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "export const enum Numbers { one = 1 }",
            errors: [{ messageId: "forbidden" }],
            options: [{ allowLocal: true }],
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
