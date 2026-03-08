import rule from "../../src/rules/no-unnecessary-template-literal";
import { ruleTester } from "../_internal/ruleTester";

const dollarSign = String.fromCodePoint(36);
const suffixInterpolation = `${dollarSign}{suffix}`;

ruleTester.run("no-unnecessary-template-literal", rule, {
    invalid: [
        {
            code: "const x = `value`;",
            errors: [{ messageId: "forbidden" }],
        },
    ],
    valid: [
        {
            code: `const x = \`value ${suffixInterpolation}\`;`,
        },
    ],
});
