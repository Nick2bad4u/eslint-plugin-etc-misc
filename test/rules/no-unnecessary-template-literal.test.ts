import rule from "../../src/rules/no-unnecessary-template-literal";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("no-unnecessary-template-literal", rule, {
    invalid: [
        {
            code: "const x = `value`;",
            errors: [{ messageId: "forbidden" }],
        },
    ],
    valid: [
        {
            code: String.raw`const x = \`value \${suffix}\`;`,
        },
    ],
});
