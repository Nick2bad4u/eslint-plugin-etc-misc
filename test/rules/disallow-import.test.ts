import rule from "../../src/rules/disallow-import";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("disallow-import", rule, {
    invalid: [
        {
            code: 'import value from "../source";',
            errors: [{ messageId: "disallowedSource" }],
            options: [{ disallow: ["../**"] }],
        },
    ],
    valid: [
        {
            code: 'import value from "../source";',
            options: [{ allow: ["../source"], disallow: ["../**"] }],
        },
    ],
});
