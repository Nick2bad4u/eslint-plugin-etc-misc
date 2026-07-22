import rule from "../../src/rules/no-unnecessary-initialization";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("no-unnecessary-initialization", rule, {
    invalid: [
        {
            code: "let x = undefined; var y = undefined; class C { x = undefined; }",
            errors: [
                { messageId: "forbidden" },
                { messageId: "forbidden" },
                { messageId: "forbidden" },
            ],
            output: "let x; var y; class C { x; }",
        },
        {
            code: "class C { readonly x: string = undefined; }",
            errors: [{ messageId: "forbidden" }],
            output: "class C { readonly x: string; }",
        },
    ],
    valid: [
        {
            code: "const x = 1; class C { x = 1; }",
        },
        {
            code: "const x = undefined;",
        },
        {
            code: "let { value } = undefined; let [first] = undefined;",
        },
        {
            code: "using resource = undefined; async function dispose() { await using asyncResource = undefined; }",
        },
        {
            code: "function read(undefined) { let value = undefined; class Box { value = undefined; } return value; }",
        },
        {
            code: "{ const undefined = 1; let value = undefined; void value; }",
        },
        {
            code: 'import { value as undefined } from "package"; let result = undefined; void result;',
        },
    ],
});
