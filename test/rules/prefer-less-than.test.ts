import rule from "../../src/rules/prefer-less-than";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("prefer-less-than", rule, {
    invalid: [
        {
            code: "const result = 54 > 42;",
            errors: [
                {
                    messageId: "forbiddenGT",
                    suggestions: [
                        {
                            messageId: "suggestLT",
                            output: "const result = 42 < 54;",
                        },
                    ],
                },
            ],
            output: "const result = 42 < 54;",
        },
        {
            code: "const result = 54 >= 42;",
            errors: [
                {
                    messageId: "forbiddenGTE",
                    suggestions: [
                        {
                            messageId: "suggestLTE",
                            output: "const result = 42 <= 54;",
                        },
                    ],
                },
            ],
            output: "const result = 42 <= 54;",
        },
        {
            code: "if (x > a && x < b) { run(); }",
            errors: [
                {
                    messageId: "forbiddenGT",
                    suggestions: [
                        {
                            messageId: "suggestLT",
                            output: "if (a < x && x < b) { run(); }",
                        },
                    ],
                },
            ],
            output: "if (a < x && x < b) { run(); }",
        },
    ],
    valid: [
        {
            code: "const result = 42 < 54;",
        },
        {
            code: "const result = 42 <= 54;",
        },
        {
            code: "if (a < x && x < b) { run(); }",
        },
    ],
});
