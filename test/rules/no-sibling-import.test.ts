import rule from "../../src/rules/no-sibling-import";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("no-sibling-import", rule, {
    invalid: [
        {
            code: 'import value from "./source";',
            errors: [{ messageId: "disallowedSource" }],
        },
    ],
    valid: [
        {
            code: 'import value from "../source";',
        },
        {
            code: 'import value from "./source";',
            options: [{ allow: ["./source"] }],
        },
    ],
});
