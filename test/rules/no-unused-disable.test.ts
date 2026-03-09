import rule from "../../src/rules/no-unused-disable";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("no-unused-disable", rule, {
    invalid: [
        {
            code: ["/* eslint-disable no-alert */", "const value = 1;"].join(
                "\n"
            ),
            errors: [{ message: /.+/v }],
        },
    ],
    valid: [
        {
            code: ["/* eslint-disable no-alert */", "alert('x');"].join("\n"),
        },
    ],
});
