import rule from "../../src/rules/class-match-filename";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("class-match-filename", rule, {
    invalid: [
        {
            code: "export class NotFileName {}",
            errors: [{ messageId: "mismatch" }],
            filename: "ClassName.ts",
        },
    ],
    valid: [
        {
            code: "export class ClassName {}",
            filename: "ClassName.ts",
        },
    ],
});
