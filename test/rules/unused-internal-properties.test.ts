import deprecatedRule from "../../src/rules/unused-internal-properties";
import { anyMessageError, ruleTester } from "../_internal/ruleTester";

ruleTester.run("unused-internal-properties", deprecatedRule, {
    invalid: [
        {
            code: [
                "const data = { used: 1, unused: 2 };",
                "console.log(data.used);",
            ].join("\n"),
            errors: [anyMessageError(/.+/v)],
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
