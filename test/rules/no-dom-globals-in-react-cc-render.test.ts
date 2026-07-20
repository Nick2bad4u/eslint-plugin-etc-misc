import rule from "../../src/rules/no-dom-globals-in-react-cc-render";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("no-dom-globals-in-react-cc-render", rule, {
    invalid: [
        {
            code: "class Header { render() { return <div>{window.innerWidth}</div>; } }",
            errors: [{ messageId: "forbidden" }],
            filename: "file.tsx",
        },
        {
            code: "class Header { render() { const title = document.title; return <>{title}</>; } }",
            errors: [{ messageId: "forbidden" }],
            filename: "file.tsx",
        },
        {
            code: "class Header { render() { return <div>{(() => window.innerWidth)()}</div>; } }",
            errors: [{ messageId: "forbidden" }],
            filename: "file.tsx",
        },
    ],
    valid: [
        {
            code: "const window = { innerWidth: 1 }; class Header { render() { return <div>{window.innerWidth}</div>; } }",
            filename: "file.tsx",
        },
        {
            code: "class Header { componentDidMount() { document.title = 'ready'; } render() { return <div />; } }",
            filename: "file.tsx",
        },
        {
            code: "class Header { render() { return <div>{typeof window !== 'undefined' ? window.innerWidth : 0}</div>; } }",
            filename: "file.tsx",
        },
        {
            code: "class Header { render() { const onClick = () => window.alert('clicked'); return <button onClick={onClick} />; } }",
            filename: "file.tsx",
        },
        {
            code: "class Utility { render() { return 1; } method() { return window.innerWidth; } }",
            filename: "file.tsx",
        },
    ],
});
