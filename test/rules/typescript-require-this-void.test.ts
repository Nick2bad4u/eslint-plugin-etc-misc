import rule from "../../src/rules/typescript-require-this-void";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("typescript-require-this-void", rule, {
    invalid: [
        {
            code: "class C { static f() {} }",
            errors: [{ messageId: "forbidden" }],
        },
    ],
    valid: [
        {
            code: "class C { static f(this: void) {} }",
        },
    ],
});
