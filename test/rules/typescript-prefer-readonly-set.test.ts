import rule from "../../src/rules/typescript-prefer-readonly-set";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("typescript-prefer-readonly-set", rule, {
    invalid: [
        {
            code: "function f(x: Set<string>) {}",
            errors: [{ messageId: "forbidden" }],
            output: "function f(x: ReadonlySet<string>) {}",
        },
        {
            code: "type Wrapped = Promise<Set<number>>;",
            errors: [{ messageId: "forbidden" }],
            output: "type Wrapped = Promise<ReadonlySet<number>>;",
        },
    ],
    valid: [
        {
            code: "function f(x: ReadonlySet<string>) {}",
        },
    ],
});
