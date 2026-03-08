import rule from "../../src/rules/typescript-prefer-readonly-set";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("typescript-prefer-readonly-set", rule, {
    invalid: [
        {
            code: "function f(x: Set<string>) {}",
            errors: [{ messageId: "forbidden" }],
        },
    ],
    valid: [
        {
            code: "function f(x: ReadonlySet<string>) {}",
        },
    ],
});
