import rule from "../../src/rules/typescript-no-never";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("typescript-no-never", rule, {
    invalid: [
        {
            code: "const fail = (): never => { throw new Error('x'); }; const result = fail();",
            errors: [{ messageId: "forbidden" }],
        },
    ],
    valid: [
        {
            code: "type Never = never;",
        },
    ],
});
