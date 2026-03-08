import rule from "../../src/rules/no-unnecessary-as-const";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("no-unnecessary-as-const", rule, {
    invalid: [
        {
            code: "const x = {} as const; const y: I = { value: 1 } as const;",
            errors: [{ messageId: "forbidden" }, { messageId: "forbidden" }],
        },
    ],
    valid: [
        {
            code: "const z = { value: 1 } as const;",
        },
    ],
});
