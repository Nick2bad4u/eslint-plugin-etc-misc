import rule from "../../src/rules/no-commented-out-code";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("no-commented-out-code", rule, {
    invalid: [
        {
            code: "// const answer = 54;\nconst answer = 42;",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "/* const answer = 54; */\nconst answer = 42;",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: [
                "// // Wrong answer",
                "// const answer = 54;",
                "const answer = 42;",
            ].join("\n"),
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: [
                "const outer = [",
                "  a,",
                "  // b,",
                "  c,",
                "];",
            ].join("\n"),
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: [
                "class Outer {",
                "  public a: string;",
                "  // public b: string;",
                "  public c: string;",
                "}",
            ].join("\n"),
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: [
                "import {",
                "  a,",
                "  // b,",
                "  c,",
                '} from "outer";',
            ].join("\n"),
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: [
                "type Outer = {",
                "  readonly a: string;",
                "  // readonly b: string;",
                "  readonly c: string;",
                "};",
            ].join("\n"),
            errors: [{ messageId: "forbidden" }],
        },
    ],
    valid: [
        {
            code: "// This comment is not code.\nconst answer = 42;",
        },
        {
            code: [
                "// This comment includes code as an example:",
                "// const answer = 54;",
                "const answer = 42;",
            ].join("\n"),
        },
        {
            code: [
                "// TODO: remove once feature flag is gone",
                "const answer = 42;",
            ].join("\n"),
        },
        {
            code: [
                "class SomeClass {",
                "  // #region Some region",
                "  someMethod() {}",
                "  // #endregion",
                "}",
            ].join("\n"),
        },
        {
            code: "// 00000000-0000-0000-0000-000000000000",
        },
        {
            code: [
                "// arrange",
                "// act",
                "// assert",
            ].join("\n"),
        },
    ],
});
