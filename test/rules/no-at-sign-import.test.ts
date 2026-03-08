import rule from "../../src/rules/no-at-sign-import";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("no-at-sign-import", rule, {
    invalid: [
        {
            code: 'import value from "@";',
            errors: [{ messageId: "disallowedSource" }],
        },
    ],
    valid: [
        {
            code: 'import value from "@/folder";',
        },
        {
            code: 'import value from "@";',
            options: [{ allow: ["@"] }],
        },
    ],
});
