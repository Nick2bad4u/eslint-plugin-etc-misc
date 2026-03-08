import rule from "../../src/rules/typescript-no-boolean-literal-type";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("typescript-no-boolean-literal-type", rule, {
    invalid: [
        {
            code: "interface I { x?: true; y?: false }",
            errors: [{ messageId: "forbidden" }, { messageId: "forbidden" }],
        },
    ],
    valid: [
        {
            code: "interface I { x?: boolean }",
        },
    ],
});
