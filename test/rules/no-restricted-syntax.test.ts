import rule from "../../src/rules/no-restricted-syntax";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("no-restricted-syntax", rule, {
    invalid: [
        {
            code: "if (x) { y(); }",
            errors: [{ messageId: "forbidden" }],
            options: [{ selectors: ["IfStatement"] }],
        },
        {
            code: "while (true) { break; }",
            errors: [{ messageId: "customMessage" }],
            options: [
                {
                    selectors: [
                        {
                            message: "No while loops",
                            selector: "WhileStatement",
                        },
                    ],
                },
            ],
        },
    ],
    valid: [
        {
            code: "for (;;) { break; }",
            options: [{ selectors: ["IfStatement"] }],
        },
    ],
});
