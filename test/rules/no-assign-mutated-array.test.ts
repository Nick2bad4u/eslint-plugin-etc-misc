import rule from "../../src/rules/no-assign-mutated-array";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("no-assign-mutated-array", rule, {
    invalid: [
        {
            code: "const values = [0, 1, 2, 3]; const sorted = values.sort((left, right) => left - right);",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "const values = [0, 1, 2, 3]; const next = values.reverse().map((value) => value);",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "const values = [0, 1, 2, 3]; function consume(input: number[]): void {} consume(values.fill(0));",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "const values = [0, 1, 2, 3]; let next: number[]; next = values.fill(0);",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "const values: [number, number] = [1, 2]; const next = values.reverse();",
            errors: [{ messageId: "forbidden" }],
        },
    ],
    valid: [
        {
            code: "const values = [0, 1, 2, 3]; values.sort((left, right) => left - right);",
        },
        {
            code: "const values = [0, 1, 2, 3]; const sorted = values.slice().sort((left, right) => left - right);",
        },
        {
            code: "const values = [0, 1, 2, 3]; const sorted = values.map((value) => value).sort((left, right) => left - right);",
        },
        {
            code: "const values = [0, 1, 2, 3]; const sorted = Array.from(values).reverse();",
        },
        {
            code: "class Bucket { public fill(): this { return this; } } const bucket = new Bucket(); const next = bucket.fill();",
        },
    ],
});
