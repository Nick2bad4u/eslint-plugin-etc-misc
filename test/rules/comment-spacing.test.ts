import rule from "../../src/rules/comment-spacing";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("comment-spacing", rule, {
    invalid: [
        {
            code: "/*\n * docs\n */\nconst value = 1;",
            errors: [{ messageId: "invalidSpacing" }],
            output: "/*\n * docs\n */\n\nconst value = 1;",
        },
    ],
    valid: [
        {
            code: "/*\n * docs\n */\n\nconst value = 1;",
        },
    ],
});
