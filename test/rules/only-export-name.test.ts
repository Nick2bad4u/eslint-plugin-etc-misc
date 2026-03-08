import rule from "../../src/rules/only-export-name";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("only-export-name", rule, {
    invalid: [
        {
            code: "export const value = 1;",
            errors: [{ messageId: "forbidden" }],
        },
    ],
    valid: [
        {
            code: "export default 1;",
        },
        {
            code: "export const value = 1;",
            options: [{ names: ["value"] }],
        },
    ],
});
