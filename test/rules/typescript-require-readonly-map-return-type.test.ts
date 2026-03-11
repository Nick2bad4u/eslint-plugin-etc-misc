import rule from "../../src/rules/typescript-require-readonly-map-return-type";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("typescript-require-readonly-map-return-type", rule, {
    invalid: [
        {
            code: "function buildMap(): Map<string, number> { return new Map(); }",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRequireReadonlyMapReturnType",
                            output: "function buildMap(): ReadonlyMap<string, number> { return new Map(); }",
                        },
                    ],
                },
            ],
            output: "function buildMap(): ReadonlyMap<string, number> { return new Map(); }",
        },
        {
            code: "type Resolver = () => Map<string, string> | null;",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRequireReadonlyMapReturnType",
                            output: "type Resolver = () => ReadonlyMap<string, string> | null;",
                        },
                    ],
                },
            ],
            output: "type Resolver = () => ReadonlyMap<string, string> | null;",
        },
        {
            code: "interface API { lookup(): Map<string, string>; }",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestRequireReadonlyMapReturnType",
                            output: "interface API { lookup(): ReadonlyMap<string, string>; }",
                        },
                    ],
                },
            ],
            output: "interface API { lookup(): ReadonlyMap<string, string>; }",
        },
    ],
    valid: [
        {
            code: "function buildMap(): ReadonlyMap<string, number> { return new Map(); }",
        },
        {
            code: "type Resolver = () => ReadonlyMap<string, string> | null;",
        },
        {
            code: "function buildConfig(): Promise<Map<string, string>> { return Promise.resolve(new Map()); }",
        },
        {
            code: "function buildConfig(): { values: Map<string, string> } { return { values: new Map() }; }",
        },
    ],
});
