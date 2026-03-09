import rule from "../../src/rules/default-case";
import { anyMessageError, ruleTester } from "../_internal/ruleTester";

ruleTester.run("default-case", rule, {
    invalid: [
        {
            code: [
                "switch (value) {",
                "  case 1:",
                "    break;",
                "}",
            ].join("\n"),
            errors: [anyMessageError(/.+/v)],
        },
    ],
    valid: [
        {
            code: [
                "switch (value) {",
                "  case 1:",
                "    break;",
                "  default:",
                "    break;",
                "}",
            ].join("\n"),
        },
    ],
});
