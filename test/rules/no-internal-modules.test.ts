import rule from "../../src/rules/no-internal-modules";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("no-internal-modules", rule, {
    invalid: [
        {
            code: 'import value from "./folder/internal";',
            errors: [{ messageId: "disallowedSource" }],
        },
        {
            code: 'import value from "package/internal";',
            errors: [{ messageId: "disallowedSource" }],
        },
        {
            code: 'import value from "@scope/package/internal";',
            errors: [{ messageId: "disallowedSource" }],
        },
    ],
    valid: [
        {
            code: 'import value from "./folder";',
        },
        {
            code: 'import value from "package";',
        },
        {
            code: 'import value from "@scope/package";',
        },
        {
            code: 'import value from "@/folder/internal";',
        },
    ],
});
