import rule from "../../src/rules/match-filename";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("match-filename", rule, {
    invalid: [
        {
            code: "function doThing() {}",
            errors: [
                {
                    data: {
                        expected: "do-thing",
                    },
                    messageId: "mismatch",
                },
            ],
            filename: "helper.ts",
        },
        {
            code: "function doThing() {}",
            errors: [
                {
                    data: {
                        expected: "do-thing",
                    },
                    messageId: "mismatch",
                },
            ],
            filename: "do-thing.ts",
            options: [{ match: false }],
        },
        {
            code: "function doThing() {}",
            errors: [
                {
                    data: {
                        expected: "x-do-thing.dto",
                    },
                    messageId: "mismatch",
                },
            ],
            filename: "do-thing.ts",
            options: [{ prefix: "x-", suffix: ".dto" }],
        },
        {
            code: "function doThing() {}",
            errors: [
                {
                    data: {
                        expected: "doThing",
                    },
                    messageId: "mismatch",
                },
            ],
            filename: "do-thing.ts",
            options: [{ format: "camelCase" }],
        },
    ],
    valid: [
        {
            code: "function doThing() {}",
            filename: "do-thing.ts",
        },
        {
            code: "function doThing() {}",
            filename: "helper.ts",
            options: [{ match: false }],
        },
        {
            code: "function doThing() {}",
            filename: "x-do-thing.dto.ts",
            options: [{ prefix: "x-", suffix: ".dto" }],
        },
        {
            code: "function doThing() {}",
            filename: "do-thing.ts",
            options: [{ selector: "FunctionDeclaration > Identifier.id" }],
        },
        {
            code: "function doThing() {}",
            filename: "helper.ts",
            options: [{ selector: "FunctionDeclaration" }],
        },
        {
            code: "interface UserProfile {}",
            filename: "user-profile.ts",
        },
    ],
});
