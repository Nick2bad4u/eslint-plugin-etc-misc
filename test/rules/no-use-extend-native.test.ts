import rule from "../../src/rules/no-use-extend-native";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("no-use-extend-native", rule, {
    invalid: [
        {
            code: "const value = 'unicorn'.green;",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "const value = [].customFunction();",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "const value = String.prototype.shortHash();",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "const value = 'abc'.length();",
            errors: [{ messageId: "forbidden" }],
        },
    ],
    valid: [
        {
            code: "const value = 'abc'.toUpperCase();",
        },
        {
            code: "const maybeLabel = 'abc'?.toUpperCase?.();",
        },
        {
            code: "const value = [].map((entry) => entry);",
        },
        {
            code: "const value = ({ a: 1 }).toString();",
        },
        {
            code: "const value = object.green;",
        },
        {
            code: "const value = values[index];",
        },
        {
            code: "const value = ''.concat(suffix)['toUpperCase'];",
        },
        {
            code: "const value = String.prototype.toLowerCase.call('ABC');",
        },
    ],
});
