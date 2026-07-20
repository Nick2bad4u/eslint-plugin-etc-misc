import rule from "../../src/rules/require-memo";
import { ruleTester } from "../_internal/ruleTester";

const filename = "component.tsx";

ruleTester.run("require-memo", rule, {
    invalid: [
        {
            code: "export function Card() { return <div />; }",
            errors: [{ messageId: "memoRequired" }],
            filename,
        },
        {
            code: "export const Card = () => <div />;",
            errors: [{ messageId: "memoRequired" }],
            filename,
        },
        {
            code: "export default () => <div />;",
            errors: [{ messageId: "memoRequired" }],
            filename,
        },
        {
            code: "const Card = () => <div />; export { Card };",
            errors: [{ messageId: "memoRequired" }],
            filename,
        },
        {
            code: "import { forwardRef } from 'react'; export const Input = forwardRef((props, ref) => <input ref={ref} />);",
            errors: [{ messageId: "memoRequired" }],
            filename,
        },
    ],
    valid: [
        {
            code: "import { memo } from 'react'; export const Card = memo(() => <div />);",
            filename,
        },
        {
            code: "import React from 'react'; export default React.memo(function Card() { return <div />; });",
            filename,
        },
        {
            code: "const Card = () => <div />;",
            filename,
        },
        {
            code: "export const helper = () => <div />;",
            filename,
        },
        {
            code: "export const Card = (one, two, three) => <div />;",
            filename,
        },
        {
            code: "export const InternalCard = () => <div />;",
            filename,
            options: [{ ignoredComponents: { "Internal*": true } }],
        },
        {
            code: "export function Card() { return 1; }",
            filename,
        },
    ],
});
