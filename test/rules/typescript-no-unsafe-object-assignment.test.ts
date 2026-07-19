import typescriptNoUnsafeObjectAssignmentRule from "../../src/rules/typescript-no-unsafe-object-assignment";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run(
    "typescript-no-unsafe-object-assignment",
    typescriptNoUnsafeObjectAssignmentRule,
    {
        invalid: [
            {
                code: "type Target = { readonly id: string; count: number }; declare const target: Target; Object.assign(target, { id: 'changed' });",
                errors: [{ messageId: "forbidden" }],
            },
        ],
        valid: [
            {
                code: "type Target = { readonly id: string; count: number }; declare const target: Target; Object.assign(target, { count: 2 });",
            },
        ],
    }
);
