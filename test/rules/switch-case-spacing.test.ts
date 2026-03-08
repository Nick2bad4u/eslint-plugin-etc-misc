import rule from "../../src/rules/switch-case-spacing";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("switch-case-spacing", rule, {
    invalid: [
        {
            code: "switch (x) { case 1: foo(); }",
            errors: [{ messageId: "forbidden" }],
        },
    ],
    valid: [
        {
            code: "switch (x) { case 1: { foo(); break; } }",
        },
    ],
});
