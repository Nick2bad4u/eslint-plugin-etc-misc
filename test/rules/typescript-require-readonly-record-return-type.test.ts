import rule from "../../src/rules/typescript-require-readonly-record-return-type";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("typescript-require-readonly-record-return-type", rule, {
    invalid: [
        {
            code: "function buildRecord(): Record<string, number> { return {}; }",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId:
                                "suggestRequireReadonlyRecordReturnType",
                            output: "function buildRecord(): Readonly<Record<string, number>> { return {}; }",
                        },
                    ],
                },
            ],
            output: "function buildRecord(): Readonly<Record<string, number>> { return {}; }",
        },
        {
            code: "type Resolver = () => Record<string, string> | null;",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId:
                                "suggestRequireReadonlyRecordReturnType",
                            output: "type Resolver = () => Readonly<Record<string, string>> | null;",
                        },
                    ],
                },
            ],
            output: "type Resolver = () => Readonly<Record<string, string>> | null;",
        },
        {
            code: "interface API { lookup(): Record<string, string>; }",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId:
                                "suggestRequireReadonlyRecordReturnType",
                            output: "interface API { lookup(): Readonly<Record<string, string>>; }",
                        },
                    ],
                },
            ],
            output: "interface API { lookup(): Readonly<Record<string, string>>; }",
        },
    ],
    valid: [
        {
            code: "function buildRecord(): Readonly<Record<string, number>> { return {}; }",
        },
        {
            code: "type Resolver = () => Readonly<Record<string, string>> | null;",
        },
        {
            code: "function buildConfig(): Promise<Record<string, string>> { return Promise.resolve({}); }",
        },
        {
            code: "function buildConfig(): { values: Record<string, string> } { return { values: {} }; }",
        },
    ],
});
