import rule from "../../src/rules/prefer-const-require";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("prefer-const-require", rule, {
    invalid: [
        {
            code: 'function loadPath() { return require("node:path"); }',
            errors: [{ messageId: "forbidden" }],
        },
    ],
    valid: [
        {
            code: 'const path = require("node:path");',
        },
    ],
});
