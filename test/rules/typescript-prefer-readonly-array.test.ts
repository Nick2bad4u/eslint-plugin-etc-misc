import rule from "../../src/rules/typescript-prefer-readonly-array";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("typescript-prefer-readonly-array", rule, {
    invalid: [
        {
            code: "function f(x: string[]) {}",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "function f(x: Array<string>) {}",
            errors: [{ messageId: "forbidden" }],
        },
    ],
    valid: [
        {
            code: "function f(x: readonly string[]) {}",
        },
        {
            code: "function f(x: ReadonlyArray<string>) {}",
        },
    ],
});
