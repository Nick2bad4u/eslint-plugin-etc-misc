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
            options: [{ functions: ["fit", "fdescribe"] }],
        },
        {
            code: 'test.only("case", () => {});',
            errors: [{ messageId: "focusedTest" }],
            options: [{ fix: true }],
            output: 'test("case", () => {});',
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
        'test["only"]("computed", () => {});',
        {
            code: "const fit = 1; const value = { fit: 2 };",
            options: [{ functions: ["fit"] }],
        },
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
