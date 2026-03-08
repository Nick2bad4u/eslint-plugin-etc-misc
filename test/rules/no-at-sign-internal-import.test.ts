import rule from "../../src/rules/no-at-sign-internal-import";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("no-at-sign-internal-import", rule, {
    invalid: [
        {
            code: 'import value from "@/folder";',
            errors: [{ messageId: "disallowedSource" }],
        },
    ],
    valid: [
        {
            code: 'import value from "@";',
        },
        {
            code: 'import value from "@/folder";',
            options: [{ allow: ["@/**"] }],
        },
    ],
});
