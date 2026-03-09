import rule from "../../src/rules/export-matching-filename-only";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("export-matching-filename-only", rule, {
    invalid: [
        {
            code: "export class User {}\nexport const extra = 1;",
            errors: [{ messageId: "onlyExport" }],
            filename: "User.ts",
        },
    ],
    valid: [
        {
            code: "export class User {}",
            filename: "User.ts",
        },
    ],
});
