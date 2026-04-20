import deprecatedRule from "../../src/rules/typescript-class-methods-use-this";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("typescript-class-methods-use-this", deprecatedRule, {
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
            code: "class C { static method() { return 1; } }",
        },
        {
            code: "class C { get value() { return 1; } }",
        },
        {
            code: "class C { method(this: void) { return 1; } }",
        },
    ],
});
