import rule from "../../src/rules/typescript-no-restricted-syntax";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("typescript-no-restricted-syntax", rule, {
    invalid: [
        {
            code: "if (value) { call(); }",
            errors: [{ messageId: "forbidden" }],
            options: [
                {
                    selectors: [{ selector: "IfStatement" }],
                },
            ],
        },
    ],
    valid: [
        {
            code: "while (value) { call(); }",
            options: [
                {
                    selectors: [{ selector: "IfStatement" }],
                },
            ],
        },
    ],
});
