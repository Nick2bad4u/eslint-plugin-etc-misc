import rule from "../../src/rules/no-foreach";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("no-foreach", rule, {
    invalid: [
        {
            code: "[42].forEach((value) => console.log(value));",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "const values = [42]; values.forEach((value) => console.log(value));",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "function values() { return [42]; } values().forEach((value) => console.log(value));",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "const map = new Map<string, string>(); map.forEach((value) => console.log(value));",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "const set = new Set<string>(); set.forEach((value) => console.log(value));",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "const values = [42]; values.forEach((value) => console.log(value));",
            errors: [{ messageId: "forbidden" }],
            options: [{ types: ["Array"] }],
        },
    ],
    valid: [
        {
            code: "for (const value of [42]) { console.log(value); }",
        },
        {
            code: "import { of } from \"rxjs\"; of(42).forEach((value) => console.log(value));",
        },
        {
            code: "const map = new Map<string, string>(); map.forEach((value) => console.log(value));",
            options: [{ types: ["Array"] }],
        },
    ],
});
