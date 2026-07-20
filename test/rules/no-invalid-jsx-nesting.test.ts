import rule from "../../src/rules/no-invalid-jsx-nesting";
import { ruleTester } from "../_internal/ruleTester";

const filename = "component.tsx";

ruleTester.run("no-invalid-jsx-nesting", rule, {
    invalid: [
        {
            code: "function App() { return <p><div /></p>; }",
            errors: [{ messageId: "invalidAncestor" }],
            filename,
        },
        {
            code: "function App() { return <p><span><div /></span></p>; }",
            errors: [{ messageId: "invalidAncestor" }],
            filename,
        },
        {
            code: "function App() { return <table><tr><td /></tr></table>; }",
            errors: [{ messageId: "invalidParent" }],
            filename,
        },
        {
            code: "function App() { return <div><td /></div>; }",
            errors: [{ messageId: "invalidParent" }],
            filename,
        },
        {
            code: "function App() { return <img><span /></img>; }",
            errors: [{ messageId: "voidParent" }],
            filename,
        },
        {
            code: "function App() { return <p><><div /></></p>; }",
            errors: [{ messageId: "invalidAncestor" }],
            filename,
        },
        {
            code: "function App({ items }) { return <p>{items.map(() => <div />)}</p>; }",
            errors: [{ messageId: "invalidAncestor" }],
            filename,
        },
        {
            code: "function App({ items }) { return <p>{items.map(() => { return <div />; })}</p>; }",
            errors: [{ messageId: "invalidAncestor" }],
            filename,
        },
    ],
    valid: [
        {
            code: "function App() { return <p><span>ok</span></p>; }",
            filename,
        },
        {
            code: "function Item() { return <li />; }",
            filename,
        },
        {
            code: "function Row() { return <tr><td /></tr>; }",
            filename,
        },
        {
            code: "function App() { return <ul><div /></ul>; }",
            filename,
        },
        {
            code: "function App() { return <picture><div /></picture>; }",
            filename,
        },
        {
            code: "function App() { return <table><tbody><tr><td>x</td></tr></tbody></table>; }",
            filename,
        },
        {
            code: "function App() { return <p><Layout><div /></Layout></p>; }",
            filename,
        },
        {
            code: "function App() { return <p><_Boundary><div /></_Boundary></p>; }",
            filename,
        },
        {
            code: "function App({ condition }) { return <div>{condition && <span />}</div>; }",
            filename,
        },
        {
            code: "function App() { return <my-element><div /></my-element>; }",
            filename,
        },
        {
            code: "function App() { return <p slot={<div />} />; }",
            filename,
        },
        {
            code: "function App({ items }) { return <p>{items.map(() => { const preview = <div />; return <span />; })}</p>; }",
            filename,
        },
        {
            code: "function App({ items }) { return <p>{items.map(() => <span />, function Context() { return <div />; })}</p>; }",
            filename,
        },
    ],
});
