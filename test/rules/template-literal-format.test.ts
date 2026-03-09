import rule from "../../src/rules/template-literal-format";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("template-literal-format", rule, {
    invalid: [
        {
            code: "const msg = `line\n  body\nline`;",
            errors: [{ messageId: "invalidFormat" }],
        },
    ],
    valid: [
        {
            code: "const msg = `\n  body\n`;",
        },
    ],
});
