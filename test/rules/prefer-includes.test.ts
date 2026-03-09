import rule from "../../src/rules/prefer-includes";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("prefer-includes", rule, {
    invalid: [
        {
            code: "const hasValue = [1, 2, 3].indexOf(2) !== -1; void hasValue;",
            errors: [{ message: /.+/v }],
        },
    ],
    valid: [
        {
            code: "const hasValue = [1, 2, 3].includes(2); void hasValue;",
        },
    ],
});
