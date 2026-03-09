import deprecatedRule from "../../src/rules/typescript-no-inferrable-types";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("typescript-no-inferrable-types", deprecatedRule, {
    invalid: [
        {
            code: "const value: number = 1;",
            errors: [{ messageId: "forbidden" }],
        },
    ],
    valid: [
        {
            code: "const value = 1; const other: number = parseInt('1', 10);",
        },
    ],
});
