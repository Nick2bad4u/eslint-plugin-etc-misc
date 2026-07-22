import rule from "../../src/rules/no-unnecessary-template-literal";
import { ruleTester } from "../_internal/ruleTester";

const dollarSign = String.fromCodePoint(36);
const suffixInterpolation = `${dollarSign}{suffix}`;

ruleTester.run("no-unnecessary-template-literal", rule, {
    invalid: [
        {
            code: "const x = `value`;",
            errors: [{ messageId: "forbidden" }],
            output: 'const x = "value";',
        },
        {
            code: "const x = `line\\nvalue`;",
            errors: [{ messageId: "forbidden" }],
            output: String.raw`const x = "line\nvalue";`,
        },
        {
            code: "function f() { `use strict`; return this; }",
            errors: [{ messageId: "forbidden" }],
            output: null,
        },
    ],
    valid: [
        {
            code: `const x = \`value ${suffixInterpolation}\`;`,
        },
        {
            code: "tag`value`; String.raw`line\\nvalue`;",
        },
    ],
});
