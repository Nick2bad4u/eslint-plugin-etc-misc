import rule from "../../src/rules/no-unnecessary-initialization";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("no-unnecessary-initialization", rule, {
    invalid: [
        {
            code: "const x = undefined; class C { x = undefined; }",
            errors: [{ messageId: "forbidden" }, { messageId: "forbidden" }],
        },
    ],
    valid: [
        {
            code: "const x = 1; class C { x = 1; }",
        },
    ],
});
