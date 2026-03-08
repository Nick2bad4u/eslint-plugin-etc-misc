import rule from "../../src/rules/no-expression-empty-lines";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("no-expression-empty-lines", rule, {
    invalid: [
        {
            code: "someCall(\n\n 1\n);",
            errors: [{ messageId: "forbidden" }],
            output: "someCall(\n 1\n);",
        },
    ],
    valid: [
        {
            code: "someCall(1);",
        },
    ],
});
