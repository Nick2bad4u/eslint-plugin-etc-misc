import rule from "../../src/rules/require-syntax";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("require-syntax", rule, {
    invalid: [
        {
            code: "const x = 1;",
            errors: [{ messageId: "missing" }],
            options: [{ selectors: ["ExportDefaultDeclaration"] }],
        },
    ],
    valid: [
        {
            code: "export default 1;",
            options: [{ selectors: ["ExportDefaultDeclaration"] }],
        },
    ],
});
