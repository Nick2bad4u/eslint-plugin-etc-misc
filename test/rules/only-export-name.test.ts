import rule from "../../src/rules/only-export-name";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("only-export-name", rule, {
    invalid: [
        {
            code: "export const value = 1;",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "export default 1;",
            errors: [{ messageId: "forbidden" }],
            options: [{ names: ["value"] }],
        },
        {
            code: "export function value(): number { return 1; }",
            errors: [{ messageId: "forbidden" }],
            options: [{ names: ["allowed"] }],
        },
        {
            code: "export class Value {}",
            errors: [{ messageId: "forbidden" }],
            options: [{ names: ["Allowed"] }],
        },
        {
            code: "const localValue = 1; export { localValue as value };",
            errors: [{ messageId: "forbidden" }],
            options: [{ names: ["allowed"] }],
        },
        {
            code: "export const omega7 = 1;",
            errors: [{ messageId: "forbidden" }],
            options: [{ names: ["alpha1"] }],
        },
        {
            code: "export const delta8 = 1;",
            errors: [{ messageId: "forbidden" }],
            options: [{ names: ["beta2", "gamma3"] }],
        },
        {
            code: "export const zeta9 = 1;",
            errors: [{ messageId: "forbidden" }],
            options: [
                {
                    names: [
                        "gamma4",
                        "alpha5",
                        "beta6",
                    ],
                },
            ],
        },
    ],
    valid: [
        {
            code: "export default 1;",
        },
        {
            code: "export const value = 1;",
            options: [{ names: ["value"] }],
        },
        {
            code: "export function allowed(): number { return 1; }",
            options: [{ names: ["allowed"] }],
        },
        {
            code: "export class Allowed {}",
            options: [{ names: ["Allowed"] }],
        },
        {
            code: "const localValue = 1; export { localValue as allowed };",
            options: [{ names: ["allowed"] }],
        },
        {
            code: 'const localValue = 1; export { localValue as "kebab-name" };',
            options: [{ names: [] }],
        },
        {
            code: "export const { value } = { value: 1 };",
            options: [{ names: [] }],
        },
        {
            code: "export {};",
            options: [{ names: [] }],
        },
        {
            code: "export const alpha1 = 1;",
            options: [{ names: ["alpha1"] }],
        },
        {
            code: "export const beta2 = 1;",
            options: [{ names: ["beta2", "gamma3"] }],
        },
        {
            code: "export const gamma4 = 1;",
            options: [
                {
                    names: [
                        "gamma4",
                        "alpha5",
                        "beta6",
                    ],
                },
            ],
        },
    ],
});
