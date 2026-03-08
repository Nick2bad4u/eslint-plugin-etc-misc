import rule from "../../src/rules/underscore-internal";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("underscore-internal", rule, {
    invalid: [
        {
            code: "/** @internal */ export const SOME_CONSTANT = 0;",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "/** @internal */ export class SomeClass {}",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "export class Thing { /** @internal */ doWork(): void {} }",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "/** @internal */ export enum SomeEnum { MEMBER = 0 }",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "export interface Shape { /** @internal */ width: number; }",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "/** @internal */ export type SomeType = string;",
            errors: [{ messageId: "forbidden" }],
        },
    ],
    valid: [
        {
            code: "export const SOME_CONSTANT = 0;",
        },
        {
            code: "/** @internal */ export const _SOME_CONSTANT = 0;",
        },
        {
            code: "export class Thing { /** @internal */ _doWork(): void {} }",
        },
        {
            code: "/** @internal */ export interface _Shape { width: number; }",
        },
        {
            code: "/** @internal */ export type _SomeType = string;",
        },
    ],
});
