import deprecatedRule from "../../src/rules/require-jsdoc";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("require-jsdoc", deprecatedRule, {
    invalid: [
        {
            code: "function f() {}",
            errors: [{ messageId: "missing" }],
            options: [{ kinds: ["function"] }],
        },
        {
            code: "class Thing {}",
            errors: [{ messageId: "missing" }],
            options: [{ kinds: ["class"] }],
        },
        {
            code: "class Thing { doWork(): void {} }",
            errors: [{ messageId: "missing" }],
            options: [{ kinds: ["method"] }],
        },
        {
            code: "type Thing = string;",
            errors: [{ messageId: "missing" }],
            options: [{ kinds: ["type"] }],
        },
        {
            code: "interface Thing { value: string; }",
            errors: [{ messageId: "missing" }],
            options: [{ kinds: ["type"] }],
        },
        {
            code: "const toThing = (value: string): string => value;",
            errors: [{ messageId: "missing" }],
            options: [{ kinds: ["arrow-function"] }],
        },
        {
            code: "/* ordinary block */ function f() {}",
            errors: [{ messageId: "missing" }],
            options: [{ kinds: ["function"] }],
        },
        {
            code: "/** docs */ /* trailing */ function f() {}",
            errors: [{ messageId: "missing" }],
            options: [{ kinds: ["function"] }],
        },
        {
            code: "type MissingDocs = string;",
            errors: [{ messageId: "missing" }],
        },
    ],
    valid: [
        {
            code: "/** docs */ function f() {}",
            options: [{ kinds: ["function"] }],
        },
        {
            code: "/** docs */ class Thing {}",
            options: [{ kinds: ["class"] }],
        },
        {
            code: "class Thing { /** docs */ doWork(): void {} }",
            options: [{ kinds: ["method"] }],
        },
        {
            code: "/** docs */ type Thing = string;",
            options: [{ kinds: ["type"] }],
        },
        {
            code: "/** docs */ interface Thing { value: string; }",
            options: [{ kinds: ["type"] }],
        },
        {
            code: "/** docs */ const toThing = (value: string): string => value;",
            options: [{ kinds: ["arrow-function"] }],
        },
        {
            code: "export default function (): void {}",
            options: [{ kinds: ["function"] }],
        },
        {
            code: "export default class {}",
            options: [{ kinds: ["class"] }],
        },
        {
            code: "class Thing { constructor(readonly value: string) {} }",
            options: [{ kinds: ["method"] }],
        },
        {
            code: 'class Thing { ["doWork"](): void {} }',
            options: [{ kinds: ["method"] }],
        },
        {
            code: "let toThing = (value: string): string => value;",
            options: [{ kinds: ["arrow-function"] }],
        },
        {
            code: "const { toThing } = { toThing: (value: string): string => value };",
            options: [{ kinds: ["arrow-function"] }],
        },
        {
            code: "function f() {}",
            options: [{ kinds: [] }],
        },
    ],
});
