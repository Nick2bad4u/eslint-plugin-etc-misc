import rule from "../../src/rules/prefer-arrow-function-property";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("prefer-arrow-function-property", rule, {
    invalid: [
        {
            code: "const x = { f() {}, g: function () {} };",
            errors: [{ messageId: "forbidden" }, { messageId: "forbidden" }],
        },
    ],
    valid: [
        {
            code: "const y = { f: () => {}, g(this: void) {}, h: function (this: void) {} };",
        },
    ],
});
