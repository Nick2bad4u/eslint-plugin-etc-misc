import rule from "../../src/rules/no-dom-globals-in-constructor";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("no-dom-globals-in-constructor", rule, {
    invalid: [
        {
            code: "class Example { constructor() { this.title = document.title; } }",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "class Example { constructor(width = window.innerWidth) { void width; } }",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "class Example { width = window.innerWidth; }",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "class Example { constructor() { (() => document.title)(); } }",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "class Example { constructor(items) { this.widths = items.map(() => window.innerWidth); } }",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "class Example { constructor() { let hasWindow = typeof window !== 'undefined'; if (hasWindow) { this.width = window.innerWidth; } } }",
            errors: [{ messageId: "forbidden" }],
        },
    ],
    valid: [
        "const window = { innerWidth: 1 }; class View { constructor() { this.width = window.innerWidth; } }",
        "class Example { initialize() { this.title = document.title; } }",
        "class Example { constructor() { if (typeof window !== 'undefined') { this.width = window.innerWidth; } } }",
        "class Example { constructor() { if (typeof globalThis.document !== 'undefined') { this.title = globalThis.document.title; } } }",
        "class Example { constructor() { const hasDocument = 'document' in globalThis; if (hasDocument) { this.title = globalThis.document.title; } } }",
        "class Example { constructor() { this.readWidth = () => window.innerWidth; } }",
        "class Example { constructor() { const window = { innerWidth: 1 }; this.width = window.innerWidth; } }",
        "class Example { static width = window.innerWidth; }",
    ],
});
