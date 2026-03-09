import rule from "../../src/rules/no-value-tostring";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("no-value-tostring", rule, {
    invalid: [
        {
            code: [
                "const value: {} = {};",
                "const asText = value.toString();",
                "void asText;",
            ].join("\n"),
            errors: [{ message: /.+/u }],
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
