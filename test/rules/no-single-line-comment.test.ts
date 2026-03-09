import rule from "../../src/rules/no-single-line-comment";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("no-single-line-comment", rule, {
    invalid: [
        {
            code: ["// explanation", "const value = 1;"].join("\n"),
            errors: [{ messageId: "forbidden" }],
        },
    ],
    valid: [
        {
            code: ["/* explanation */", "const value = 1;"].join("\n"),
        },
    ],
});
