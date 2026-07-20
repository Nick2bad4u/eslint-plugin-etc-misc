import rule from "../../src/rules/sort-imports";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("sort-imports", rule, {
    invalid: [
        {
            code: 'import local from "./local";\nimport packageValue from "package";',
            errors: [{ messageId: "sort" }],
            output: 'import packageValue from "package";\n\nimport local from "./local";',
        },
        {
            code: 'import { zebra, alpha } from "package";',
            errors: [{ messageId: "sort" }],
            output: 'import { alpha,zebra } from "package";',
        },
        {
            code: 'import image10 from "./image10";\nimport image2 from "./image2";',
            errors: [{ messageId: "sort" }],
            options: [{ groups: [[String.raw`^\.`]] }],
            output: 'import image2 from "./image2";\nimport image10 from "./image10";',
        },
        {
            code: 'import value from "package"; // value\n// local\nimport local from "./local";',
            errors: [{ messageId: "sort" }],
            options: [{ groups: [[String.raw`^\.`, "^"]] }],
            output: '// local\nimport local from "./local";\nimport value from "package"; // value',
        },
    ],
    valid: [
        'import "./setup";\nimport "./polyfill";',
        'import fs from "node:fs";\n\nimport value from "package";\n\nimport local from "./local";',
        'import type { Type } from "package";\nimport { value } from "package";\nconsole.log(value);',
        'const value = require("package");',
    ],
});
