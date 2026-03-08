import rule from "../../src/rules/consistent-symbol-description";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("consistent-symbol-description", rule, {
    invalid: [
        {
            code: 'const x = Symbol("PascalCase");',
            errors: [{ messageId: "forbidden" }],
        },
    ],
    valid: [
        {
            code: 'const x = Symbol("kebab-case__kebab-case");',
        },
    ],
});
