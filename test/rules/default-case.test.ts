import rule from "../../src/rules/default-case";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("default-case", rule, {
    invalid: [
        {
            code: [
                "switch (value) {",
                "  case 1:",
                "    break;",
                "}",
            ].join("\n"),
            errors: [{ message: /.+/u }],
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
