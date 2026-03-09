import deprecatedRule from "../../src/rules/words";
import { anyMessageError, ruleTester } from "../_internal/ruleTester";

ruleTester.run("words", deprecatedRule, {
    invalid: [
        {
            code: [
                "// simply do this",
                "const value = 1;",
                "void value;",
            ].join("\n"),
            errors: [anyMessageError(/.+/v)],
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
