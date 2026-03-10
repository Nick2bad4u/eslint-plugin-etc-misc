import rule from "../../src/rules/typescript-require-this-void";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("typescript-require-this-void", rule, {
    invalid: [
        {
            code: "class C { static f() {} }",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestAddThisVoid",
                            output: "class C { static f(this: void) {} }",
                        },
                    ],
                },
            ],
            output: "class C { static f(this: void) {} }",
        },
        {
            code: "class C { static f(x: string) {} }",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestAddThisVoid",
                            output: "class C { static f(this: void, x: string) {} }",
                        },
                    ],
                },
            ],
            output: "class C { static f(this: void, x: string) {} }",
        },
        {
            code: "class C { static f(this: unknown) {} }",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestAddThisVoid",
                            output: "class C { static f(this: void) {} }",
                        },
                    ],
                },
            ],
            output: "class C { static f(this: void) {} }",
        },
    ],
    valid: [
        {
            code: "class C { static f(this: void) {} }",
        },
    ],
});
