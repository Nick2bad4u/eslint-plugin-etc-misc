import deprecatedRule from "../../src/rules/consistent-source-extension";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("consistent-source-extension", deprecatedRule, {
    invalid: [
        {
            code: 'import x1 from "source.js"; import x2 from "source.json"; import x3 from "source.ts";',
            errors: [
                { messageId: "forbidden" },
                { messageId: "forbidden" },
                { messageId: "forbidden" },
            ],
        },
    ],
    valid: [
        {
            code: 'import x1 from "source"; export { x1 } from "module";',
        },
    ],
});
