import rule from "../../src/rules/decorator-position";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("decorator-position", rule, {
    invalid: [
        {
            code: "class Example {\n    @tracked\n    value = 1;\n}",
            errors: [{ messageId: "expectedInline" }],
            output: "class Example {\n    @tracked value = 1;\n}",
        },
        {
            code: "class Example {\n    @action method() {}\n}",
            errors: [{ messageId: "expectedAbove" }],
            output: "class Example {\n    @action\n    method() {}\n}",
        },
        {
            code: [
                "class Example {",
                "    @first",
                "    @second",
                "    value = 1;",
                "}",
            ].join("\n"),
            errors: [{ messageId: "expectedInline" }],
            output: [
                "class Example {",
                "    @first",
                "    @second value = 1;",
                "}",
            ].join("\n"),
        },
        {
            code: "class Example {\n    @service() value = 1;\n}",
            errors: [{ messageId: "expectedAbove" }],
            options: [
                {
                    overrides: {
                        above: [["@service", { withArgs: true }]],
                    },
                },
            ],
            output: "class Example {\n    @service()\n    value = 1;\n}",
        },
        {
            code: "class Example {\n    @tracked veryLongPropertyName = 1;\n}",
            errors: [{ messageId: "expectedAbove" }],
            options: [{ printWidth: 24 }],
            output: "class Example {\n    @tracked\n    veryLongPropertyName = 1;\n}",
        },
        {
            code: "class Example {\n    @tracked // preserve this explanation\n    value = 1;\n}",
            errors: [{ messageId: "expectedInline" }],
            output: null,
        },
        {
            code: "class Example {\r\n\t@action method() {}\r\n}",
            errors: [{ messageId: "expectedAbove" }],
            output: "class Example {\r\n\t@action\r\n\tmethod() {}\r\n}",
        },
        {
            code: "class Example {\n    @service\n    accessor current = 1;\n}",
            errors: [{ messageId: "expectedInline" }],
            output: "class Example {\n    @service accessor current = 1;\n}",
        },
    ],
    valid: [
        "class Example { @tracked value = 1; @action\nmethod() {} }",
        "class Example {\n    @first\n    @second value = 1;\n}",
        {
            code: "class Example {\n    @service()\n    value = 1;\n}",
            options: [
                {
                    overrides: {
                        above: [["service", { withArgs: true }]],
                        "prefer-inline": [["service", { withArgs: false }]],
                    },
                },
            ],
        },
        {
            code: [
                "class Example {",
                "    @configure({",
                "        enabled: true,",
                "    })",
                "    value = 1;",
                "}",
            ].join("\n"),
        },
        {
            code: "class Example {\n    @namespace.decorator value = 1;\n}",
        },
        {
            code: "class Example {\n    @service\n    #value = 1;\n}",
            options: [{ properties: "above" }],
        },
        {
            code: "class Example {\n    @service\n    ['value'] = 1;\n}",
            options: [{ properties: "above" }],
        },
    ],
});
