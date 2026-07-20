import rule from "../../src/rules/sort-exports";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("sort-exports", rule, {
    invalid: [
        {
            code: "export { zebra, alpha };",
            errors: [{ messageId: "sort" }],
            output: "export { alpha,zebra };",
        },
        {
            code: 'export * from "./z";\nexport * from "./a";',
            errors: [{ messageId: "sort" }],
            output: 'export * from "./a";\nexport * from "./z";',
        },
        {
            code: 'export { zebra as z, alpha as a } from "package";',
            errors: [{ messageId: "sort" }],
            output: 'export { alpha as a,zebra as z } from "package";',
        },
    ],
    valid: [
        "export const zebra = 1;\nexport const alpha = 2;",
        "export { alpha, zebra };",
        'export * from "./z";\n// Preserve this manual group.\nexport * from "./a";',
        "export default function example() {}",
    ],
});
