import rule from "../../src/rules/no-underscore-export";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("no-underscore-export", rule, {
    invalid: [
        {
            code: "export const _x = 1; export function _f() {}",
            errors: [{ messageId: "forbidden" }, { messageId: "forbidden" }],
        },
    ],
    valid: [
        {
            code: "export const x = 1; export function f() {}",
        },
    ],
});
