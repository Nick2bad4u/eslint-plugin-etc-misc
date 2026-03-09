import deprecatedRule from "../../src/rules/no-useless-generics";
import {
    anyMessageErrorWithOptions,
    ruleTester,
} from "../_internal/ruleTester";

ruleTester.run("no-useless-generics", deprecatedRule, {
    invalid: [
        {
            code: "function toUpper<T>(value: string): string { return value.toUpperCase(); }",
            errors: [anyMessageErrorWithOptions(/.+/v, { suggestions: 1 })],
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
