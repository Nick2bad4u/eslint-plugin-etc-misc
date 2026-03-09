import rule from "../../src/rules/no-useless-generics";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("no-useless-generics", rule, {
    invalid: [
        {
            code: "function toUpper<T>(value: string): string { return value.toUpperCase(); }",
            errors: [{ message: /.+/u }],
            filename: "file.ts",
        },
    ],
    valid: [
        {
            code: "function identity<T>(value: T): T { return value; }",
            filename: "file.ts",
        },
    ],
});
