import rule from "../../src/rules/no-explicit-type-exports";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("no-explicit-type-exports", rule, {
    invalid: [
        {
            code: "interface Props { label: string }\nexport { Props };",
            errors: [{ messageId: "typeOverValue" }],
            filename: "file.ts",
            output: "interface Props { label: string }\nexport type { Props };",
        },
        {
            code: [
                "type Props = { label: string };",
                "const value = 1;",
                "export { Props, value };",
            ].join("\n"),
            errors: [{ messageId: "singleExportIsType" }],
            filename: "file.ts",
            output: [
                "type Props = { label: string };",
                "const value = 1;",
                "export type { Props };",
                "export { value };",
            ].join("\n"),
        },
        {
            code: [
                "type Props = { label: string };",
                "const value = 1;",
                "export { Props, value };",
            ].join("\n"),
            errors: [{ messageId: "singleExportIsType" }],
            filename: "file.ts",
            options: [{ fixMixedExportsWithInlineTypeSpecifier: true }],
            output: [
                "type Props = { label: string };",
                "const value = 1;",
                "export { type Props, value };",
            ].join("\n"),
        },
        {
            code: "type Props = {};\nexport { Props as PublicProps };",
            errors: [{ messageId: "typeOverValue" }],
            filename: "file.ts",
            output: "type Props = {};\nexport type { Props as PublicProps };",
        },
    ],
    valid: [
        {
            code: "interface Props {}\nexport type { Props };",
            filename: "file.ts",
        },
        {
            code: "class Component {}\nexport { Component };",
            filename: "file.ts",
        },
        {
            code: "type Value = number;\nexport type { Value };",
            filename: "file.ts",
        },
        {
            code: "export { Unknown } from 'unresolved-package';",
            filename: "file.ts",
        },
    ],
});
