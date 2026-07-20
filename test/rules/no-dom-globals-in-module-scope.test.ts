import rule from "../../src/rules/no-dom-globals-in-module-scope";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("no-dom-globals-in-module-scope", rule, {
    invalid: [
        {
            code: "const title = document.title; void title;",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "const title = globalThis.document.title; void title;",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "const title = globalThis['document'].title; void title;",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "class Example { static width = window.innerWidth; }",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "class Example { static { document.title = 'SSR'; } }",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "(() => window.innerWidth)();",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "((() => window.innerWidth) as () => number)();",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "((() => window.innerWidth)!)();",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "((() => window.innerWidth) satisfies () => number)();",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "(<() => number>(() => window.innerWidth))();",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "(() => window.innerWidth)?.();",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "if (true) { window.addEventListener('load', () => {}); }",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "if (typeof window) { window.addEventListener('load', () => {}); }",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "if (!true) { window.addEventListener('load', () => {}); }",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "if (typeof document !== 'undefined') { window.addEventListener('load', () => {}); }",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "typeof window === 'browser' && window.addEventListener('load', () => {});",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "const width = window.innerWidth;",
            errors: [{ messageId: "forbidden" }],
            filename: "module.test.ts",
        },
    ],
    valid: [
        "const window = { innerWidth: 1 }; { const width = window.innerWidth; void width; }",
        "const getTitle = () => document.title;",
        "if (typeof window !== 'undefined') { window.addEventListener('load', () => {}); }",
        "typeof window !== 'undefined' && window.addEventListener('load', () => {});",
        "typeof window === 'undefined' ? undefined : window.addEventListener('load', () => {});",
        "typeof window === 'undefined' || window.addEventListener('load', () => {});",
        "typeof window === 'object' && window.addEventListener('load', () => {});",
        "!(typeof window === 'undefined') && window.addEventListener('load', () => {});",
        "if (!(typeof window !== 'undefined')) { /* unavailable */ } else { window.addEventListener('load', () => {}); }",
        "typeof window;",
        "const key = 'document'; const title = globalThis[key]; void title;",
        "const window = { innerWidth: 100 }; const width = window.innerWidth; void width;",
        "type BrowserNode = HTMLElement; void (0 as unknown as BrowserNode);",
        "class Example { width = window.innerWidth; }",
    ],
});
