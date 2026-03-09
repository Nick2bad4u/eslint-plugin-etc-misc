import deprecatedRule from "../../src/rules/prefer-object-has-own";
import { anyMessageError, ruleTester } from "../_internal/ruleTester";

ruleTester.run("prefer-object-has-own", deprecatedRule, {
    invalid: [
        {
            code: [
                "const value = Object.prototype.hasOwnProperty.call({ a: 1 }, 'a');",
                "void value;",
            ].join("\n"),
            errors: [anyMessageError(/.+/v)],
            output: [
                "const value = Object.hasOwn({ a: 1 }, 'a');",
                "void value;",
            ].join("\n"),
        },
    ],
    valid: [
        {
            code: "const value = Object.hasOwn({ a: 1 }, 'a'); void value;",
        },
    ],
});
