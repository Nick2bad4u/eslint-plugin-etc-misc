import rule from "../../src/rules/no-index-import";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("no-index-import", rule, {
    invalid: [
        {
            code: 'import value from ".";',
            errors: [{ messageId: "disallowedSource" }],
        },
        {
            code: 'export { value } from ".";',
            errors: [{ messageId: "disallowedSource" }],
        },
    ],
    valid: [
        {
            code: 'import value from "./folder";',
        },
        {
            code: 'import value from ".";',
            options: [{ allow: ["."] }],
        },
    ],
});
