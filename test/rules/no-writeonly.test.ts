import rule from "../../src/rules/no-writeonly";
import { anyMessageError, ruleTester } from "../_internal/ruleTester";

ruleTester.run("no-writeonly", rule, {
    invalid: [
        {
            code: "const state = { set value(next) { this._value = next; } }; void state;",
            errors: [anyMessageError(/.+/v)],
        },
    ],
    valid: [
        {
            code: [
                "const state = {",
                "  _value: 0,",
                "  get value() { return this._value; },",
                "  set value(next) { this._value = next; },",
                "};",
                "void state;",
            ].join("\n"),
        },
    ],
});
