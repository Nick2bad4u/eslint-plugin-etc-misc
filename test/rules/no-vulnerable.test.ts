import rule from "../../src/rules/no-vulnerable";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("no-vulnerable", rule, {
    invalid: [
        {
            code: "const pattern = /(a+)+$/;",
            errors: [{ messageId: "vulnerable" }],
        },
        {
            code: "const pattern = RegExp('(a+)+$');",
            errors: [{ messageId: "vulnerable" }],
        },
        {
            code: "const pattern = new RegExp('(a+)+$', 'u');",
            errors: [{ messageId: "vulnerable" }],
        },
        {
            code: "const pattern = RegExp('(');",
            errors: [{ messageId: "checkerError" }],
            options: [{ ignoreErrors: false }],
        },
    ],
    valid: [
        {
            code: "const safe = /^a+$/;",
        },
        {
            code: "const pattern = /(a+)+$/;",
            options: [
                {
                    permittableComplexities: ["exponential", "polynomial"],
                },
            ],
        },
        {
            code: "const safe = RegExp('^a+$');",
        },
        {
            code: "const pattern = RegExp('(');",
        },
        {
            code: "const source = '(a+)+$'; const maybeUnsafe = RegExp(source);",
        },
        {
            code: "const maybeUnsafe = RegExp('(a+)+$', flags);",
        },
        {
            code: "const maybeUnsafe = RegExp('(a+)+$', ...flagsParts);",
        },
        {
            code: "const maybeUnsafe = RegExp`(a+)+$`;",
        },
    ],
});
