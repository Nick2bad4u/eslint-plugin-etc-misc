import deprecatedRule from "../../src/rules/consistent-filename";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("consistent-filename", deprecatedRule, {
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
