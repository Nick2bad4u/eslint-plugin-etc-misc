import rule from "../../src/rules/typescript-no-complex-return-type";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("typescript-no-complex-return-type", rule, {
    invalid: [
        {
            code: "const create = () => ((() => 1) as (() => number));",
            errors: [{ messageId: "forbidden" }],
        },
    ],
    valid: [
        {
            code: "const create = (): () => number => (() => 1);",
        },
    ],
});
