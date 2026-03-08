import rule from "../../src/rules/no-enum";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("no-enum", rule, {
    invalid: [
        {
            code: "enum Numbers { one = 1 }",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "export enum Numbers { one = 1 }",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "const enum Numbers { one = 1 }",
            errors: [{ messageId: "forbidden" }],
        },
    ],
    valid: [
        {
            code: "const numbers = { one: 1 } as const;",
        },
        {
            code: "type NumberValue = 1 | 2;",
        },
    ],
});
