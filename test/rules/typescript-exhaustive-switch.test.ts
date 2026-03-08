import rule from "../../src/rules/typescript-exhaustive-switch";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("typescript-exhaustive-switch", rule, {
    invalid: [
        {
            code: "switch (x) { case 1: break; case 2: break; }",
            errors: [{ messageId: "forbidden" }],
        },
    ],
    valid: [
        {
            code: "switch (x) { case 1: break; default: break; }",
        },
    ],
});
