import rule from "../../src/rules/no-dom-globals-in-react-fc";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("no-dom-globals-in-react-fc", rule, {
    invalid: [
        {
            code: "const Header = () => <div>{window.innerWidth}</div>;",
            errors: [{ messageId: "forbidden" }],
            filename: "file.tsx",
        },
        {
            code: "function Header() { const title = document.title; return <>{title}</>; }",
            errors: [{ messageId: "forbidden" }],
            filename: "file.tsx",
        },
        {
            code: "const Header = () => { const width = useMemo(() => window.innerWidth, []); return <div>{width}</div>; };",
            errors: [{ messageId: "forbidden" }],
            filename: "file.tsx",
        },
        {
            code: "const Header = () => { const [width] = useState(() => window.innerWidth); return <div>{width}</div>; };",
            errors: [{ messageId: "forbidden" }],
            filename: "file.tsx",
        },
        {
            code: "const Header = React.forwardRef(function Header(_props, ref) { return <div ref={ref}>{document.title}</div>; });",
            errors: [{ messageId: "forbidden" }],
            filename: "file.tsx",
        },
        {
            code: "const Header = memo(() => <div>{globalThis.document.title}</div>);",
            errors: [{ messageId: "forbidden" }],
            filename: "file.tsx",
        },
        {
            code: "const Header = () => <div>{globalThis['document'].title}</div>;",
            errors: [{ messageId: "forbidden" }],
            filename: "file.tsx",
        },
    ],
    valid: [
        {
            code: "const window = { innerWidth: 1 }; const Header = () => <div>{window.innerWidth}</div>;",
            filename: "file.tsx",
        },
        {
            code: "const Header = () => { useEffect(() => { document.title = 'ready'; }, []); return <div />; };",
            filename: "file.tsx",
        },
        {
            code: "const Header = () => <button onClick={() => window.alert('clicked')} />;",
            filename: "file.tsx",
        },
        {
            code: "const Header = () => <div>{typeof window !== 'undefined' ? window.innerWidth : 0}</div>;",
            filename: "file.tsx",
        },
        {
            code: "const helper = () => window.innerWidth; void helper;",
            filename: "file.tsx",
        },
        {
            code: "const Header = () => { const window = { innerWidth: 1 }; return <div>{window.innerWidth}</div>; };",
            filename: "file.tsx",
        },
        {
            code: "const Header = () => { Hooks[hookName](() => window.innerWidth); return <div />; };",
            filename: "file.tsx",
        },
        {
            code: "function Header() { const Nested = () => <span />; void Nested; return window.innerWidth; }",
            filename: "file.tsx",
        },
        {
            code: "const registry = { render: () => <div>{window.innerWidth}</div> }; void registry;",
            filename: "file.tsx",
        },
    ],
});
