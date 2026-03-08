import rule from "../../src/rules/sort-call-signature";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("sort-call-signature", rule, {
    invalid: [
        {
            code: "interface I { x: string; (): string; }",
            errors: [{ messageId: "forbidden" }],
        },
    ],
    valid: [
        {
            code: "interface I { (): string; x: string; }",
        },
    ],
});
