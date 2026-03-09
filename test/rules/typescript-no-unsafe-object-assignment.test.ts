import rule from "../../src/rules/typescript-no-unsafe-object-assignment";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("typescript-no-unsafe-object-assignment", rule, {
    invalid: [
        {
            code: "type Target = { readonly x: number }; const target: Target = { x: 1 }; Object.assign(target, { x: 2 });",
            errors: [{ messageId: "forbidden" }],
        },
    ],
    valid: [
        {
            code: "type Target = { x: number }; const target: Target = { x: 1 }; Object.assign(target, { x: 2 });",
        },
    ],
});
