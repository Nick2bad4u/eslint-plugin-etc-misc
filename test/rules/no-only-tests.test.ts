import rule from "../../src/rules/no-only-tests";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("no-only-tests", rule, {
    invalid: [
        {
            code: 'describe.only("suite", () => {});',
            errors: [{ messageId: "focusedTest" }],
        },
        {
            code: 'test.concurrent.only("case", () => {});',
            errors: [{ messageId: "focusedTest" }],
        },
        {
            code: 'test.only.each([1])("case", () => {});',
            errors: [{ messageId: "focusedTest" }],
        },
        {
            code: 'test.each([1]).only("case", () => {});',
            errors: [{ messageId: "focusedTest" }],
        },
        {
            code: 'test.only.concurrent("case", () => {});',
            errors: [{ messageId: "focusedTest" }],
        },
        {
            code: 'test.describe.only("suite", () => {});',
            errors: [{ messageId: "focusedTest" }],
        },
        {
            code: 'QUnit.test.only("case", () => {});',
            errors: [{ messageId: "focusedTest" }],
        },
        {
            code: 'it.default.before(setup).only("case", () => {});',
            errors: [{ messageId: "focusedTest" }],
        },
        {
            code: 'ava.default.only("case", () => {});',
            errors: [{ messageId: "focusedTest" }],
            options: [{ block: ["ava.default"] }],
        },
        {
            code: 'testResource.only("case", () => {});',
            errors: [{ messageId: "focusedTest" }],
            options: [{ block: ["test*"] }],
        },
        {
            code: 'test.focus("case", () => {});',
            errors: [{ messageId: "focusedTest" }],
            options: [{ focus: ["focus"] }],
        },
        {
            code: 'fit("case", () => {});',
            errors: [{ messageId: "forbiddenFunction" }],
        },
        {
            code: 'fdescribe("suite", () => {});',
            errors: [{ messageId: "forbiddenFunction" }],
        },
        {
            code: 'import { test as spec } from "vitest"; spec.only("case", () => {});',
            errors: [{ messageId: "focusedTest" }],
        },
        {
            code: 'import * as v from "vitest"; v.test.only("case", () => {});',
            errors: [{ messageId: "focusedTest" }],
        },
        {
            code: 'import check from "ava"; check.only("case", () => {});',
            errors: [{ messageId: "focusedTest" }],
        },
        {
            code: 'import { fit as focused } from "@jest/globals"; focused("case", () => {});',
            errors: [{ messageId: "forbiddenFunction" }],
        },
        {
            code: 'import { test as nodeTest } from "node:test"; nodeTest.only("case", () => {});',
            errors: [{ messageId: "focusedTest" }],
        },
        {
            code: 'import { test as bunTest } from "bun:test"; bunTest.only("case", () => {});',
            errors: [{ messageId: "focusedTest" }],
        },
        {
            code: 'import { test as playwrightTest } from "@playwright/test"; playwrightTest.describe.only("suite", () => {});',
            errors: [{ messageId: "focusedTest" }],
        },
        {
            code: 'import { describe as mochaDescribe } from "mocha"; mochaDescribe.only("suite", () => {});',
            errors: [{ messageId: "focusedTest" }],
        },
        {
            code: 'import QUnitApi from "qunit"; QUnitApi.test.only("case", () => {});',
            errors: [{ messageId: "focusedTest" }],
        },
        {
            code: 'import tapeTest from "tape"; tapeTest.only("case", () => {});',
            errors: [{ messageId: "focusedTest" }],
        },
        {
            code: 'const focused = () => {}; focused("case");',
            errors: [{ messageId: "forbiddenFunction" }],
            options: [{ functions: ["focused"] }],
        },
        {
            code: 'test.only("case", () => {});',
            errors: [{ messageId: "focusedTest" }],
            options: [{ fix: true }],
            output: 'test("case", () => {});',
        },
        {
            code: 'test.only.each([1])("case", () => {});',
            errors: [{ messageId: "focusedTest" }],
            options: [{ fix: true }],
            output: 'test.each([1])("case", () => {});',
        },
        {
            code: 'test["only"]("computed", () => {});',
            errors: [{ messageId: "focusedTest" }],
            options: [{ fix: true }],
            output: null,
        },
        {
            code: 'test?.only("case", () => {});',
            errors: [{ messageId: "focusedTest" }],
            options: [{ fix: true }],
            output: null,
        },
    ],
    valid: [
        'describe("suite", () => {});',
        'test.skip("case", () => {});',
        'other.only("operation", () => {});',
        'xdescribe.only("disabled suite", () => {});',
        'testResource.only("resource", () => {});',
        "const metadata = { only: true };",
        {
            code: "const fit = 1; const value = { fit: 2 };",
            options: [{ functions: ["fit"] }],
        },
        "const test = { only() {} }; test.only();",
        'function run(test) { test.only("case", () => {}); }',
        'import { test } from "vitest"; function run(test) { test.only("case", () => {}); }',
        'import { it as fit } from "vitest"; fit("case", () => {});',
        'const fit = () => {}; fit("ordinary function");',
        'import * as v from "vitest"; function run(v) { v.test.only("case", () => {}); }',
        {
            code: 'test.only("case", () => {});',
            options: [{ block: ["it"] }],
        },
        {
            code: 'test.only("case", () => {});',
            options: [{ focus: ["focus"] }],
        },
        'test("node test", { only: true }, () => {});',
    ],
});
