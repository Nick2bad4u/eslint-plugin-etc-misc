import rule from "../../src/rules/prefer-object-has-own";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("prefer-object-has-own", rule, {
    invalid: [
        {
            code: [
                "const value = Object.prototype.hasOwnProperty.call({ a: 1 }, 'a');",
                "void value;",
            ].join("\n"),
            errors: [{ message: /.+/v }],
        },
    ],
    valid: [
        {
            code: "const value = Object.hasOwn({ a: 1 }, 'a'); void value;",
        },
    ],
});
