import deprecatedRule from "../../src/rules/no-relative-parent-import";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("no-relative-parent-import", deprecatedRule, {
    invalid: [
        {
            code: 'import value from "..";',
            errors: [{ messageId: "disallowedSource" }],
        },
        {
            code: 'import value from "../source";',
            errors: [{ messageId: "disallowedSource" }],
        },
        {
            code: 'export * from "../../source";',
            errors: [{ messageId: "disallowedSource" }],
        },
    ],
    valid: [
        {
            code: 'import value from "./source";',
        },
        {
            code: 'import value from "../allowed-source";',
            options: [{ allow: ["../allowed-source"] }],
        },
        {
            code: 'import("../dynamic")',
            options: [{ allow: ["../dynamic"] }],
        },
    ],
});
