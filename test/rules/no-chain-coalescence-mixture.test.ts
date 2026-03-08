import rule from "../../src/rules/no-chain-coalescence-mixture";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("no-chain-coalescence-mixture", rule, {
    invalid: [
        {
            code: "x?.y ?? z;",
            errors: [{ messageId: "forbidden" }],
        },
    ],
    valid: [
        {
            code: "x?.y;",
        },
        {
            code: "x ?? y;",
        },
    ],
});
