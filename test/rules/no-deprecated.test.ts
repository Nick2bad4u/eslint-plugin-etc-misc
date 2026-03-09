import deprecatedRule from "../../src/rules/no-deprecated";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("no-deprecated", deprecatedRule, {
    invalid: [
        {
            code: [
                "/** @deprecated Don't use this */",
                "declare function deprecatedFunction(): void;",
                "deprecatedFunction();",
            ].join("\n"),
            errors: [
                {
                    data: {
                        comment: "Don't use this",
                        name: "deprecatedFunction",
                    },
                    messageId: "forbiddenWithComment",
                },
            ],
        },
        {
            code: [
                "/** @deprecated */",
                "declare function deprecatedWithoutComment(): void;",
                "deprecatedWithoutComment();",
            ].join("\n"),
            errors: [
                {
                    data: { name: "deprecatedWithoutComment" },
                    messageId: "forbidden",
                },
            ],
        },
        {
            code: [
                "/**",
                " * @deprecated This function is slow",
                " * @deprecated This function is buggy",
                " */",
                "declare function multiDeprecated(): void;",
                "multiDeprecated();",
            ].join("\n"),
            errors: [
                {
                    data: {
                        comment: "This function is slow",
                        name: "multiDeprecated",
                    },
                    messageId: "forbiddenWithComment",
                },
                {
                    data: {
                        comment: "This function is buggy",
                        name: "multiDeprecated",
                    },
                    messageId: "forbiddenWithComment",
                },
            ],
        },
        {
            code: [
                "/**",
                " * @deprecated Don't",
                " * use this   function",
                " */",
                "declare function wrappedDeprecated(): void;",
                "wrappedDeprecated();",
            ].join("\n"),
            errors: [
                {
                    data: {
                        comment: "Don't use this function",
                        name: "wrappedDeprecated",
                    },
                    messageId: "forbiddenWithComment",
                },
            ],
        },
        {
            code: [
                "declare namespace Legacy {",
                "  /** @deprecated Don't use this */",
                "  export interface DeprecatedInterface {",
                "    readonly value: number;",
                "  }",
                "}",
                "const value = {} as Legacy.DeprecatedInterface;",
                "void value.value;",
            ].join("\n"),
            errors: [
                {
                    data: {
                        comment: "Don't use this",
                        name: "DeprecatedInterface",
                    },
                    messageId: "forbiddenWithComment",
                },
            ],
        },
        {
            code: [
                "declare function activeFunction(): void;",
                "activeFunction();",
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
                "declare function activeFunction(): void;",
                "activeFunction();",
            ].join("\n"),
        },
        {
            code: [
                "/** @deprecated Don't use this */",
                "declare function deprecatedOnlyDeclaration(): void;",
            ].join("\n"),
        },
        {
            code: [
                "/** @deprecated Don't use this */",
                "declare function deprecatedIgnoredByName(): void;",
                "deprecatedIgnoredByName();",
            ].join("\n"),
            options: [
                {
                    ignored: {
                        "^deprecatedIgnoredByName$": "name",
                    },
                },
            ],
        },
        {
            code: [
                "declare namespace Legacy {",
                "  /** @deprecated Don't use this */",
                "  export interface DeprecatedInterface {",
                "    readonly value: number;",
                "  }",
                "}",
                "const value = {} as Legacy.DeprecatedInterface;",
                "void value.value;",
            ].join("\n"),
            options: [
                {
                    ignored: {
                        "^Legacy\\.": "path",
                    },
                },
            ],
        },
    ],
});
