import rule from "../../src/rules/words";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("words", rule, {
    invalid: [
        {
            code: [
                "// this probably works",
                "const value = 1;",
                "void value;",
            ].join("\n"),
            errors: [{ message: /.+/v }],
        },
    ],
    valid: [
        {
            code: [
                "// this works",
                "const value = 1;",
                "void value;",
            ].join("\n"),
        },
    ],
});
