import rule from "../../src/rules/no-nodejs-modules";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("no-nodejs-modules", rule, {
    invalid: [
        {
            code: 'import fs from "node:fs";',
            errors: [{ messageId: "disallowedSource" }],
        },
    ],
    valid: [
        {
            code: 'import fs from "fs";',
        },
        {
            code: 'import fs from "node:fs";',
            options: [{ allow: ["node:fs"] }],
        },
    ],
});
