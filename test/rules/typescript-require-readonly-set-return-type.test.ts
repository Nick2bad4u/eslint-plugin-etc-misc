import rule from "../../src/rules/typescript-require-readonly-set-return-type";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("typescript-require-readonly-set-return-type", rule, {
    invalid: [
        {
            code: "function buildSet(): Set<string> { return new Set(); }",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRequireReadonlySetReturnType",
                            output: "function buildSet(): ReadonlySet<string> { return new Set(); }",
                        },
                    ],
                },
            ],
            output: "function buildSet(): ReadonlySet<string> { return new Set(); }",
        },
        {
            code: "type Resolver = () => Set<string> | null;",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRequireReadonlySetReturnType",
                            output: "type Resolver = () => ReadonlySet<string> | null;",
                        },
                    ],
                },
            ],
            output: "type Resolver = () => ReadonlySet<string> | null;",
        },
        {
            code: "interface API { lookup(): Set<string>; }",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRequireReadonlySetReturnType",
                            output: "interface API { lookup(): ReadonlySet<string>; }",
                        },
                    ],
                },
            ],
            output: "interface API { lookup(): ReadonlySet<string>; }",
        },
    ],
    valid: [
        {
            code: "function buildSet(): ReadonlySet<string> { return new Set(); }",
        },
        {
            code: "type Resolver = () => ReadonlySet<string> | null;",
        },
        {
            code: "function buildConfig(): Promise<Set<string>> { return Promise.resolve(new Set()); }",
        },
        {
            code: "function buildConfig(): { values: Set<string> } { return { values: new Set() }; }",
        },
    ],
});
