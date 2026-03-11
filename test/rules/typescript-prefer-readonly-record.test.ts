import rule from "../../src/rules/typescript-prefer-readonly-record";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("typescript-prefer-readonly-record", rule, {
    invalid: [
        {
            code: "type Store = Record<string, number>;",
            errors: [{ messageId: "forbidden" }],
            output: "type Store = Readonly<Record<string, number>>;",
        },
        {
            code: "type Wrapped = Promise<Record<string, Record<string, number>>>;",
            errors: [{ messageId: "forbidden" }, { messageId: "forbidden" }],
            output: [
                "type Wrapped = Promise<Readonly<Record<string, Record<string, number>>>>;",
                "type Wrapped = Promise<Readonly<Record<string, Readonly<Record<string, number>>>>>;",
            ],
        },
    ],
    valid: [
        {
            code: "type Store = Readonly<Record<string, number>>;",
        },
        {
            code: "type Store = { [key: string]: number };",
        },
    ],
});
