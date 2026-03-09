import rule from "../../src/rules/max-identifier-blocks";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("max-identifier-blocks", rule, {
    invalid: [
        {
            code: "const AaaBbbCccDddEee = 1; const aaaBbbCccDddEee = 1;",
            errors: [
                { data: { max: 4 }, messageId: "forbidden" },
                { data: { max: 4 }, messageId: "forbidden" },
            ],
        },
        {
            code: "const objectValue = { aaaBbbCccDddEee: 1 };",
            errors: [{ data: { max: 4 }, messageId: "forbidden" }],
        },
    ],
    valid: [
        {
            code: "const aaaBbbCccDdd = 1; const obj = { aaaBbbCccDddEee };",
        },
    ],
});
