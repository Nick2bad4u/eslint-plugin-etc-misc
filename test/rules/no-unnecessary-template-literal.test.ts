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
    ],
    valid: [
        {
            code: `const x = \`value ${suffixInterpolation}\`;`,
        },
    ],
});
