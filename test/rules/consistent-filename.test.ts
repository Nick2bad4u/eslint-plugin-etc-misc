import deprecatedRule from "../../src/rules/consistent-filename";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("consistent-filename", deprecatedRule, {
    invalid: [
        {
            code: "const value = 1;",
            errors: [
                {
                    data: {
                        expected: "my-file",
                    },
                    messageId: "inconsistent",
                },
            ],
            filename: "MyFile.ts",
        },
        {
            code: "const value = 1;",
            errors: [
                {
                    data: {
                        expected: "myFile",
                    },
                    messageId: "inconsistent",
                },
            ],
            filename: "my-file.ts",
            options: [{ format: "camelCase" }],
        },
        {
            code: "const value = 1;",
            errors: [
                {
                    data: {
                        expected: "MyFile",
                    },
                    messageId: "inconsistent",
                },
            ],
            filename: "myFile.ts",
            options: [{ format: "PascalCase" }],
        },
    ],
    valid: [
        {
            code: "const value = 1;",
            filename: "my-file.ts",
        },
        {
            code: "const value = 1;",
            filename: "myFile.ts",
            options: [{ format: "camelCase" }],
        },
        {
            code: "const value = 1;",
            filename: "MyFile.ts",
            options: [{ format: "PascalCase" }],
        },
        {
            code: "const value = 1;",
        },
    ],
});
