import rule from "../../src/rules/no-internal";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("no-internal", rule, {
    invalid: [
        {
            code: [
                "/** @internal */",
                "interface InternalType {",
                "  readonly value: number;",
                "}",
                "const item: InternalType = { value: 42 };",
                "console.log(item.value);",
            ].join("\n"),
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: [
                "/** @internal Internal function details */",
                "declare function internalFunction(): void;",
                "internalFunction();",
            ].join("\n"),
            errors: [
                {
                    data: {
                        comment: "Internal function details",
                        name: "internalFunction",
                    },
                    messageId: "forbiddenWithComment",
                },
            ],
        },
        {
            code: [
                "/**",
                " * @internal First reason",
                " * @internal Second reason",
                " */",
                "declare function internalWithMultipleTags(): void;",
                "internalWithMultipleTags();",
            ].join("\n"),
            errors: [
                {
                    data: {
                        comment: "First reason",
                        name: "internalWithMultipleTags",
                    },
                    messageId: "forbiddenWithComment",
                },
                {
                    data: {
                        comment: "Second reason",
                        name: "internalWithMultipleTags",
                    },
                    messageId: "forbiddenWithComment",
                },
            ],
        },
        {
            code: [
                "interface PublicType {",
                "  readonly value: number;",
                "}",
                "const item: PublicType = { value: 42 };",
                "console.log(item.value);",
            ].join("\n"),
            errors: [
                {
                    data: {
                        pattern: "[",
                    },
                    messageId: "invalidIgnorePattern",
                },
            ],
            options: [
                {
                    ignored: {
                        "[": "name",
                    },
                },
            ],
        },
    ],
    valid: [
        {
            code: [
                "interface PublicType {",
                "  readonly value: number;",
                "}",
                "const item: PublicType = { value: 42 };",
                "console.log(item.value);",
            ].join("\n"),
        },
        {
            code: [
                "/** @internal */",
                "interface InternalType {",
                "  readonly value: number;",
                "}",
            ].join("\n"),
        },
        {
            code: [
                "/** @internal */",
                "interface InternalType {",
                "  readonly value: number;",
                "}",
                "const item: InternalType = { value: 42 };",
                "console.log(item.value);",
            ].join("\n"),
            options: [
                {
                    ignored: {
                        "^InternalType$": "name",
                    },
                },
            ],
        },
    ],
});
