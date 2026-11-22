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
        {
            code: 'if ((i = xs.indexOf("a")) > -1) console.log(i);',
            errors: [
                {
                    messageId: "forbiddenGT",
                    suggestions: [
                        {
                            messageId: "suggestLT",
                            output: 'if (-1 < (i = xs.indexOf("a"))) console.log(i);',
                        },
                    ],
                },
            ],
            output: 'if (-1 < (i = xs.indexOf("a"))) console.log(i);',
        },
        {
            code: "const result = ((1 + 2)) /* left */ >= /* right */ (1);",
            errors: [
                {
                    messageId: "forbiddenGTE",
                    suggestions: [
                        {
                            messageId: "suggestLTE",
                            output: "const result = (1) /* left */ <= /* right */ ((1 + 2));",
                        },
                    ],
                },
            ],
            output: "const result = (1) /* left */ <= /* right */ ((1 + 2));",
        },
        {
            code: "const result = x < y > z;",
            errors: [
                {
                    messageId: "forbiddenGT",
                    suggestions: [
                        {
                            messageId: "suggestLT",
                            output: "const result = z < (x < y);",
                        },
                    ],
                },
            ],
            output: "const result = z < (x < y);",
        },
        {
            code: "const result = x as number > y;",
            errors: [
                {
                    messageId: "forbiddenGT",
                    suggestions: [
                        {
                            messageId: "suggestLT",
                            output: "const result = y < (x as number);",
                        },
                    ],
                },
            ],
            output: "const result = y < (x as number);",
        },
        {
            code: "value > {};",
            errors: [
                {
                    messageId: "forbiddenGT",
                    suggestions: [
                        {
                            messageId: "suggestLT",
                            output: "({}) < value;",
                        },
                    ],
                },
            ],
            output: "({}) < value;",
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
