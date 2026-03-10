import rule from "../../src/rules/typescript-prefer-readonly-map";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("typescript-prefer-readonly-map", rule, {
    invalid: [
        {
            code: "function f(x: Map<string, string>) {}",
            errors: [{ messageId: "forbidden" }],
            output: "function f(x: ReadonlyMap<string, string>) {}",
        },
        {
            code: "type Wrapped = Promise<Map<string, number>>;",
            errors: [{ messageId: "forbidden" }],
            output: "type Wrapped = Promise<ReadonlyMap<string, number>>;",
        },
    ],
    valid: [
        {
            code: "function f(x: ReadonlyMap<string, string>) {}",
        },
    ],
});
