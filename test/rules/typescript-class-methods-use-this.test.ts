import rule from "../../src/rules/typescript-class-methods-use-this";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("typescript-class-methods-use-this", rule, {
    invalid: [
        {
            code: "class C { method() { return 1; } }",
            errors: [{ messageId: "forbidden" }],
        },
    ],
    valid: [
        {
            code: "class C { method() { return this; } }",
        },
        {
            code: "class C { method(this: void) { return 1; } }",
        },
    ],
});
