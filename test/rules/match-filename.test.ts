import rule from "../../src/rules/match-filename";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("match-filename", rule, {
    invalid: [
        {
            code: "function doThing() {}",
            errors: [{ messageId: "mismatch" }],
            filename: "helper.ts",
        },
    ],
    valid: [
        {
            code: "function doThing() {}",
            filename: "do-thing.ts",
        },
    ],
});
