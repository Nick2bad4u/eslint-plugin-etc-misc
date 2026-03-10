import { createSelectorRule } from "../../src/_internal/create-selector-rule";
import { ruleTester } from "./ruleTester";

const forbidIdentifierRule = createSelectorRule({
    description: "Disallow identifiers named forbidden",
    message: "Identifier `forbidden` is not allowed.",
    messageId: "forbiddenIdentifier",
    name: "internal/forbid-identifier",
    selector: "Identifier[name='forbidden']",
    type: "problem",
    url: "https://example.com/docs/internal-forbid-identifier",
});

ruleTester.run("createSelectorRule selector matching", forbidIdentifierRule, {
    invalid: [
        {
            code: "const forbidden = 1;",
            errors: [{ messageId: "forbiddenIdentifier" }],
        },
    ],
    valid: [
        {
            code: "const allowed = 1;",
        },
        {
            code: "const outer = { allowed: 1 };",
        },
    ],
});
