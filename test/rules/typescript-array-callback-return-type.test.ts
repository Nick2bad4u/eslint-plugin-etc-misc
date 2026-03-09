import rule from "../../src/rules/typescript-array-callback-return-type";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("typescript-array-callback-return-type", rule, {
    invalid: [
        {
            code: "[1, 2, 3].map((value) => value + 1);",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "[1, 2, 3].find((value) => value > 1);",
            errors: [{ messageId: "forbidden" }],
        },
    ],
    valid: [
        {
            code: "[1, 2, 3].map((value): number => value + 1);",
        },
        {
            code: "const collection = { map: (callback: (value: number) => number): number => callback(1) }; collection.map((value) => value + 1);",
        },
    ],
});
