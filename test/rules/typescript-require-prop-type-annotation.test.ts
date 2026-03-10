import rule from "../../src/rules/typescript-require-prop-type-annotation";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("typescript-require-prop-type-annotation", rule, {
    invalid: [
        {
            code: "class C { x; }",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestAnnotateUnknown",
                            output: "class C { x: unknown; }",
                        },
                    ],
                },
            ],
            output: "class C { x: unknown; }",
        },
    ],
    valid: [
        {
            code: "class C { x: string; y = ''; }",
        },
    ],
});
