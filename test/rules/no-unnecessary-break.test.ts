import rule from "../../src/rules/no-unnecessary-break";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("no-unnecessary-break", rule, {
    invalid: [
        {
            code: "switch (x) { case 1: break; case 2: break; }",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "switch (x) { case 1: break; default: break; }",
            errors: [{ messageId: "forbidden" }],
        },
    ],
    valid: [
        {
            code: "switch (x) { case 1: break; case 2: }",
        },
    ],
});
