import rule from "../../src/rules/no-unused-imports";
import {
    anyMessageErrorWithOptions,
    ruleTester,
} from "../_internal/ruleTester";

ruleTester.run("no-unused-imports", rule, {
    invalid: [
        {
            code: 'import unused from "pkg";\nconst value = 1;\nconsole.log(value);',
            errors: [anyMessageErrorWithOptions(/unused/v, { suggestions: 1 })],
            output: "const value = 1;\nconsole.log(value);",
        },
        {
            code: 'import { unused, used } from "pkg";\nconsole.log(used);',
            errors: [anyMessageErrorWithOptions(/unused/v, { suggestions: 1 })],
            output: 'import { used } from "pkg";\nconsole.log(used);',
        },
        {
            code: 'import value, { unused, used } from "pkg";\nconsole.log(value, used);',
            errors: [anyMessageErrorWithOptions(/unused/v, { suggestions: 1 })],
            output: 'import value, { used } from "pkg";\nconsole.log(value, used);',
        },
        {
            code: 'import type { Unused, Used } from "pkg";\nconst value: Used = {};\nconsole.log(value);',
            errors: [anyMessageErrorWithOptions(/Unused/v, { suggestions: 1 })],
            output: 'import type { Used } from "pkg";\nconst value: Used = {};\nconsole.log(value);',
        },
    ],
    valid: [
        'import used from "pkg";\nconsole.log(used);',
        'import * as namespace from "pkg";\nnamespace.run();',
        'import "side-effect-package";',
        'import type { Used } from "pkg";\nconst value: Used = {};\nconsole.log(value);',
    ],
});
