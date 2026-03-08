import rule from "../../src/rules/prefer-only-export";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("prefer-only-export", rule, {
    invalid: [
        {
            code: "export default 1; export const x = 1;",
            errors: [{ messageId: "forbidden" }],
        },
    ],
    valid: [
        {
            code: "export default 1;",
        },
    ],
});
