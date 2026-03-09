import rule from "../../src/rules/consistent-filename";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("consistent-filename", rule, {
    invalid: [
        {
            code: "const value = 1;",
            errors: [{ messageId: "inconsistent" }],
            filename: "MyFile.ts",
        },
    ],
    valid: [
        {
            code: "const value = 1;",
            filename: "my-file.ts",
        },
    ],
});
