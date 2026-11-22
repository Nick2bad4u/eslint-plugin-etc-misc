import rule from "../../src/rules/template-literal-format";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("template-literal-format", rule, {
    invalid: [
        {
            code: "const msg = `line\n  body\nline`;",
            errors: [{ messageId: "invalidFormat" }],
            output: null,
        },
        {
            code: "const sql = `SELECT *\n  FROM t`;",
            errors: [{ messageId: "invalidFormat" }],
            output: null,
        },
        {
            code: "const sql = `SELECT *\n    col1,\n  FROM t`;",
            errors: [{ messageId: "invalidFormat" }],
            output: null,
        },
        {
            code: `const msg = tag\`line\n  \${value}\`;`,
            errors: [{ messageId: "invalidFormat" }],
            output: null,
        },
    ],
    valid: [
        {
            code: "const msg = `\n  body\n`;",
        },
    ],
});
