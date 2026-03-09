import deprecatedRule from "../../src/rules/prefer-includes";
import { anyMessageError, ruleTester } from "../_internal/ruleTester";

ruleTester.run("prefer-includes", deprecatedRule, {
    invalid: [
        {
            code: "const hasValue = [1, 2, 3].indexOf(2) !== -1; void hasValue;",
            errors: [anyMessageError(/.+/v)],
            output: "const hasValue = [1, 2, 3].includes(2); void hasValue;",
        },
    ],
    valid: [
        {
            code: "const hasValue = [1, 2, 3].includes(2); void hasValue;",
        },
    ],
});
