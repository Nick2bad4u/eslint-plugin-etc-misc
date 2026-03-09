import rule from "../../src/rules/typescript-prefer-enum";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("typescript-prefer-enum", rule, {
    invalid: [
        {
            code: [
                "enum Status { Open = 'open', Closed = 'closed' }",
                "const getStatus = (): Status => {",
                "    return 'open';",
                "};",
                "console.log(getStatus());",
            ].join("\n"),
            errors: [{ messageId: "preferEnumReturn" }],
        },
        {
            code: "type Status = 'open' | 'closed';",
            errors: [{ messageId: "preferEnumUnion" }],
        },
    ],
    valid: [
        {
            code: "enum Status { Open = 'open', Closed = 'closed' }",
        },
        {
            code: [
                "type Status = string;",
                "declare const status: Status;",
                "const isOpen = status === 'open';",
                "console.log(isOpen);",
            ].join("\n"),
        },
    ],
});
