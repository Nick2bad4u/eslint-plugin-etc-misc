import rule from "../../src/rules/typescript-no-unsafe-object-assign";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("typescript-no-unsafe-object-assign", rule, {
    invalid: [
        {
            code: "type Target = { readonly id: string; count: number }; declare const target: Target; Object.assign(target, { id: 'changed' });",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "type Target = { readonly id: string; count: number }; declare const target: Target; Object.assign(target, {}, { count: 2 }, { id: 'changed' });",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "type Target = { readonly id: string; count: number }; declare const target: Target; Object.assign(target, { id: 'first' }, { id: 'second' });",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "type Target = { readonly id: string; count: number }; declare const target: Target; declare const source: { count: number } | { id: string }; Object.assign(target, source);",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "type Target = { readonly id: string; count: number }; declare const target: Target; declare const source: { count: number } & { id: string }; Object.assign(target, source);",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "type Target = { readonly id: string } | { count: number }; declare const target: Target; Object.assign(target, { id: 'changed' });",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "type Target = { readonly id: string } & { count: number }; declare const target: Target; Object.assign(target, { id: 'changed' });",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "type Target = { readonly id: string; count: number }; declare const target: Target; declare const source: { id?: string }; Object.assign(target, source);",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "type Target = { readonly id?: string; count: number }; declare const target: Target; Object.assign(target, { id: 'changed' });",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "type Target = { readonly [key: string]: unknown }; declare const target: Target; Object.assign(target, { id: 'changed' });",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "type Target = { readonly [key: number]: unknown }; declare const target: Target; Object.assign(target, { 0: 'changed' });",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "type Target = { readonly id: string; count: number }; declare const target: Target; declare const source: Record<string, unknown>; Object.assign(target, source);",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "type Target = { readonly 0: string; count: number }; declare const target: Target; declare const source: Record<number, unknown>; Object.assign(target, source);",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "type Target = { readonly [key: string]: unknown }; declare const target: Target; declare const source: Record<string, unknown>; Object.assign(target, source);",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "type Target = { readonly id: string; count: number }; declare const target: Target; function assign<T extends { id: string }>(source: T): void { Object.assign(target, source); }",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "type Target = { readonly id: string; count: number }; declare const target: Target; function assign<T extends Record<string, unknown>>(source: T): void { Object.assign(target, source); }",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "type Target = { readonly id: string; count: number }; function assign<T extends Target>(target: T): void { Object.assign(target, { id: 'changed' }); }",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "type Target = { readonly id: string; count: number }; declare const target: Target; declare const source: any; Object.assign(target, source);",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "type Target = { readonly [key: string]: unknown }; declare const target: Target; declare const source: any; Object.assign(target, source);",
            errors: [{ messageId: "forbidden" }],
        },
    ],
    valid: [
        {
            code: "type Target = { readonly id: string; count: number }; declare const target: Target; Object.assign(target);",
        },
        {
            code: "type Target = { readonly id: string; count: number }; declare const target: Target; Object.assign(target, {});",
        },
        {
            code: "type Target = { readonly id: string; count: number }; declare const target: Target; Object.assign(target, {}, {});",
        },
        {
            code: "type Target = { readonly id: string; count: number }; declare const target: Target; Object.assign(target, { count: 2 });",
        },
        {
            code: "type Target = { readonly id: string; count: number }; declare const target: Target; Object.assign(target, { count: 2 }, { label: 'safe' });",
        },
        {
            code: "type Target = { id: string; count: number }; declare const target: Target; Object.assign(target, { id: 'changed' });",
        },
        {
            code: "type Target = { readonly id: string; count: number }; declare const target: Target; declare const source: { count: number } | { label: string }; Object.assign(target, source);",
        },
        {
            code: "type Target = { readonly id: string } | { count: number }; declare const target: Target; Object.assign(target, { count: 2 });",
        },
        {
            code: "type Target = { readonly id: string } & { count: number }; declare const target: Target; Object.assign(target, { count: 2 });",
        },
        {
            code: "type Target = { readonly id: string; count: number }; declare const target: Target; declare const source: { count?: number }; Object.assign(target, source);",
        },
        {
            code: "type Target = { readonly [key: number]: string }; declare const target: Target; Object.assign(target, { id: 'safe' });",
        },
        {
            code: "type Target = { x: number; readonly [key: string]: number }; declare const target: Target; Object.assign(target, { x: 2 });",
        },
        {
            code: "type Target = { [key: string]: unknown }; declare const target: Target; Object.assign(target, { id: 'changed' });",
        },
        {
            code: "type Target = { readonly id: string; count: number }; declare const target: Target; function assign<T extends { count: number }>(source: T): void { Object.assign(target, source); }",
        },
        {
            code: "type Target = { readonly id: string; count: number }; declare const target: Target; declare const source: unknown; Object.assign(target, source);",
        },
        {
            code: "type Target = { readonly id: string; count: number }; declare const target: Target; declare const source: never; Object.assign(target, source);",
        },
        {
            code: "type Target = { readonly id: string; count: number }; declare const target: Target; Object.assign(target, null, undefined);",
        },
        {
            code: "type Target = { id: string; count: number }; declare const target: Target; declare const source: any; Object.assign(target, source);",
        },
    ],
});
