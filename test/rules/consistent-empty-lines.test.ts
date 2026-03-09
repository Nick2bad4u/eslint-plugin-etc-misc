import rule from "../../src/rules/consistent-empty-lines";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("consistent-empty-lines", rule, {
    invalid: [
        {
            code: "const a = 1;\n\n\nconst b = 2;",
            errors: [{ messageId: "inconsistent" }],
            output: "const a = 1;\n\nconst b = 2;",
        },
    ],
    valid: [
        {
            code: "const a = 1;\n\nconst b = 2;",
        },
    ],
});
