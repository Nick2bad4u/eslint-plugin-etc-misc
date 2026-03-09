import rule from "../../src/rules/unused-internal-properties";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("unused-internal-properties", rule, {
    invalid: [
        {
            code: [
                "const data = { used: 1, unused: 2 };",
                "console.log(data.used);",
            ].join("\n"),
            errors: [{ message: /.+/v }],
        },
    ],
    valid: [
        {
            code: [
                "const data = { used: 1, alsoUsed: 2 };",
                "console.log(data.used + data.alsoUsed);",
            ].join("\n"),
        },
    ],
});
