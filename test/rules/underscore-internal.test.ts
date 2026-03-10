import plugin from "../../src/plugin";
import { ruleTester } from "../_internal/ruleTester";

const generatedPublicIdentifiers = [
    "Public14",
    "Internal27",
    "Helper33",
    "Public56",
    "Internal61",
    "Helper88",
] as const;

const underscoreInternalRule = plugin.rules["underscore-internal"];

if (underscoreInternalRule === undefined) {
    throw new TypeError(
        "Rule 'underscore-internal' was not found in plugin export."
    );
}

ruleTester.run("underscore-internal", underscoreInternalRule, {
    invalid: [
        {
            code: "/** @internal */ export const SOME_CONSTANT = 0;",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "/** @internal */ export function doWork(): void {}",
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
            code: "export class Thing { /** @internal */ value = 1; }",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "/** @internal */ export enum SomeEnum { MEMBER = 0 }",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "export enum SomeEnum { /** @internal */ MEMBER = 1 }",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "export interface Shape { /** @internal */ width: number; }",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "export interface Shape { /** @internal */ getWidth(): number; }",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "/** @internal */ export type SomeType = string;",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "/** @internal */ const helperValue = 1;",
            errors: [{ messageId: "forbidden" }],
        },
        ...generatedPublicIdentifiers.map((identifierName) => ({
            code: `/** @internal */ export const ${identifierName} = 1;`,
            errors: [{ messageId: "forbidden" }],
        })),
    ],
    valid: [
        {
            code: "export const SOME_CONSTANT = 0;",
        },
        {
            code: "/** @internal */ export const _SOME_CONSTANT = 0;",
        },
        {
            code: "/** @internal */ export function _doWork(): void {}",
        },
        {
            code: "export class Thing { /** @internal */ _doWork(): void {} }",
        },
        {
            code: "export class Thing { /** @internal */ _value = 1; }",
        },
        {
            code: "/** @internal */ export interface _Shape { width: number; }",
        },
        {
            code: "export interface Shape { /** @internal */ _width: number; }",
        },
        {
            code: "export interface Shape { /** @internal */ _getWidth(): number; }",
        },
        {
            code: "/** @internal */ export type _SomeType = string;",
        },
        {
            code: "/** @internalized */ export const Visible = 1;",
        },
        {
            code: "/** @internal */ export default function (): void {}",
        },
        {
            code: "/** @internal */ export default class {}",
        },
        {
            code: 'export class Thing { /** @internal */ ["doWork"](): void {} }',
        },
        {
            code: 'export class Thing { /** @internal */ ["value"] = 1; }',
        },
        {
            code: 'export enum SomeEnum { /** @internal */ "MEMBER" = 1 }',
        },
        ...generatedPublicIdentifiers.map((identifierName) => ({
            code: `/** @internal */ export const _${identifierName} = 1;`,
        })),
    ],
});
