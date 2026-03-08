import rule from "../../src/rules/no-negated-conditions";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("no-negated-conditions", rule, {
    invalid: [
        {
            code: "if (!x) {}",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "if (x !== 1 && y) {}",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "const value = !x || y;",
            errors: [{ messageId: "forbidden" }],
        },
    ],
    valid: [
        {
            code: "if (x && y) {}",
        },
        {
            code: "if (x === 1 && y) {}",
        },
        {
            code: "const value = x && y;",
        },
    ],
});
