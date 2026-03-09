import rule from "../../src/rules/typescript-prefer-enum";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("typescript-prefer-enum", rule, {
    invalid: [
        {
            code: "type Status = 'open' | 'closed';",
            errors: [{ messageId: "preferEnumUnion" }],
        },
    ],
    valid: [
        {
            code: "enum Status { Open = 'open', Closed = 'closed' }",
        },
    ],
});
