import { createImportPatternRule } from "../../src/_internal/create-import-pattern-rule";
import { ruleTester } from "./ruleTester";

const disallowInternalImportsRule = createImportPatternRule({
    defaultDisallowPatterns: ["@internal/**"],
    description: "Disallow internal import paths",
    name: "internal/disallow-import-paths",
});

ruleTester.run(
    "createImportPatternRule default and option behavior",
    disallowInternalImportsRule,
    {
        invalid: [
            {
                code: "import value from '@internal/secret';",
                errors: [{ messageId: "disallowedSource" }],
            },
            {
                code: "export * from '@internal/secret';",
                errors: [{ messageId: "disallowedSource" }],
            },
            {
                code: "void import('@internal/dynamic');",
                errors: [{ messageId: "disallowedSource" }],
            },
            {
                code: "import value from '@custom/private';",
                errors: [{ messageId: "disallowedSource" }],
                options: [{ disallow: ["@custom/**"] }],
            },
        ],
        valid: [
            {
                code: "import value from './local';",
            },
            {
                code: "import value from '@internal/public/path';",
                options: [
                    {
                        allow: ["@internal/public/**"],
                        disallow: ["@internal/**"],
                    },
                ],
            },
            {
                code: "const source = '@internal/value'; void import(source);",
            },
        ],
    }
);
