import rule from "../../src/rules/typescript-prefer-class-method";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("typescript-prefer-class-method", rule, {
    invalid: [
        {
            code: "class C { x = () => {}; }",
            errors: [{ messageId: "forbidden" }],
        },
    ],
    valid: [
        {
            code: "class C { x(): void {} }",
        },
        {
            code: "class C { x: () => void = () => {}; }",
        },
    ],
});
