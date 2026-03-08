import rule from "../../src/rules/typescript-prefer-readonly-map";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("typescript-prefer-readonly-map", rule, {
    invalid: [
        {
            code: "function f(x: Map<string, string>) {}",
            errors: [{ messageId: "forbidden" }],
        },
    ],
    valid: [
        {
            code: "function f(x: ReadonlyMap<string, string>) {}",
        },
    ],
});
