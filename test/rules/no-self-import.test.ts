import deprecatedRule from "../../src/rules/no-self-import";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("no-self-import", deprecatedRule, {
    invalid: [
        {
            code: 'import value from "./file";',
            errors: [{ messageId: "forbidden" }],
            filename: "file.ts",
        },
    ],
    valid: [
        {
            code: 'import value from "./other-file";',
            filename: "file.ts",
        },
    ],
});
