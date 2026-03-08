import rule from "../../src/rules/no-t";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("no-t", rule, {
    invalid: [
        {
            code: "type Thing<T> = { value: T };",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "type Thing<Value> = { value: Value };",
            errors: [{ messageId: "prefix" }],
            options: [{ prefix: "T" }],
        },
    ],
    valid: [
        {
            code: "type Thing<Value> = { value: Value };",
        },
        {
            code: "type Thing<TValue> = { value: TValue };",
            options: [{ prefix: "T" }],
        },
    ],
});
