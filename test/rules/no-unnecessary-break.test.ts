import rule from "../../src/rules/no-unnecessary-break";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("no-unnecessary-break", rule, {
    invalid: [
        {
            code: "switch (x) { case 1: break; case 2: break; }",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRemove",
                            output: "switch (x) { case 1: break; case 2: }",
                        },
                    ],
                },
            ],
            output: "switch (x) { case 1: break; case 2: }",
        },
        {
            code: "switch (x) { case 1: break; default: break; }",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRemove",
                            output: "switch (x) { case 1: break; default: }",
                        },
                    ],
                },
            ],
            output: "switch (x) { case 1: break; default: }",
        },
    ],
    valid: [
        {
            code: "switch (x) { case 1: break; case 2: }",
        },
        {
            code: "outer: for (;;) { switch (x) { default: break outer; } }",
        },
    ],
});
