import rule from "../../src/rules/sort-construct-signature";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("sort-construct-signature", rule, {
    invalid: [
        {
            code: "interface I { x: string; new (): string; }",
            errors: [{ messageId: "forbidden" }],
        },
    ],
    valid: [
        {
            code: "interface I { new (): string; x: string; }",
        },
    ],
});
