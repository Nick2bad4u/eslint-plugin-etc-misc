import { createSelectorRule } from "../_internal/create-selector-rule";

/**
 * Disallow empty interfaces without extends clauses.
 */
const rule: ReturnType<typeof createSelectorRule> = createSelectorRule({
    description: "disallow empty interfaces without extends clauses.",
    message: "Empty interface is not allowed.",
    messageId: "forbidden",
    name: "typescript/no-empty-interfaces",
    selector:
        "TSInterfaceDeclaration[body.body.length=0][extends.length=0] > Identifier.id",
    type: "problem",
    url: "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/typescript-no-empty-interfaces.md",
});

export default rule;
