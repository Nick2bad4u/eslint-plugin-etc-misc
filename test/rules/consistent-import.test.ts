import rule from "../../src/rules/consistent-import";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("consistent-import", rule, {
    invalid: [
        {
            code: "import a from 'pkg';\nimport { b } from 'pkg';",
            errors: [{ messageId: "inconsistent" }],
        },
    ],
    valid: [
        {
            code: "import a from 'pkg';\nimport c from 'pkg';",
        },
    ],
});
