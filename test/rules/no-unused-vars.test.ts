import rule from "../../src/rules/no-unused-vars";
import { anyMessageError, ruleTester } from "../_internal/ruleTester";

ruleTester.run("no-unused-vars", rule, {
    invalid: [
        {
            code: "const unused = 1;",
            errors: [anyMessageError(/unused/v)],
        },
        {
            code: 'function example(unused: string): void {} example("value");',
            errors: [anyMessageError(/unused/v)],
            options: [{ args: "all" }],
        },
    ],
    valid: [
        'import unusedImport from "pkg";',
        "const used = 1; console.log(used);",
        {
            code: 'function example(_unused: string): void {} example("value");',
            options: [{ args: "all", argsIgnorePattern: "^_" }],
        },
    ],
});
