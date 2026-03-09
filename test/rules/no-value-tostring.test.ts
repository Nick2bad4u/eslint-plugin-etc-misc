import deprecatedRule from "../../src/rules/no-value-tostring";
import { anyMessageError, ruleTester } from "../_internal/ruleTester";

ruleTester.run("no-value-tostring", deprecatedRule, {
    invalid: [
        {
            code: [
                "const value: {} = {};",
                "const asText = value.toString();",
                "void asText;",
            ].join("\n"),
            errors: [anyMessageError(/.+/v)],
            filename: "file.ts",
        },
    ],
    valid: [
        {
            code: [
                "const value = 42;",
                "const asText = value.toString();",
                "void asText;",
            ].join("\n"),
            filename: "file.ts",
        },
    ],
});
