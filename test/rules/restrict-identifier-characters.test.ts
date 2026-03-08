import rule from "../../src/rules/restrict-identifier-characters";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("restrict-identifier-characters", rule, {
    invalid: [
        {
            code: "const абв = 1;",
            errors: [{ messageId: "forbidden" }],
        },
    ],
    valid: [
        {
            code: "const $x1 = 2;",
        },
    ],
});
