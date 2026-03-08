import rule from "../../src/rules/no-language-mixing";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("no-language-mixing", rule, {
    invalid: [
        {
            code: 'const x1 = "яz"; const x2 = "zя"; const x3 = "абв123xyz"; const x4 = "xyz123абв";',
            errors: [
                { messageId: "forbidden" },
                { messageId: "forbidden" },
                { messageId: "forbidden" },
                { messageId: "forbidden" },
            ],
        },
    ],
    valid: [
        {
            code: 'const x = "xyz"; const y = "123"; const z = "абв";',
        },
    ],
});
