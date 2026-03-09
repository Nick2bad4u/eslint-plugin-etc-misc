import deprecatedRule from "../../src/rules/no-unused-disable";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("no-unused-disable", deprecatedRule, {
    invalid: [],
    valid: [
        {
            code: "const value = 1; void value;",
        },
    ],
});
