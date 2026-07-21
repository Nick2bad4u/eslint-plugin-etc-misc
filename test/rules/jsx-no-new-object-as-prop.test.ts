import rule from "../../src/rules/jsx-no-new-object-as-prop";
import { ruleTester } from "../_internal/ruleTester";

const filename = "component.tsx";

ruleTester.run("jsx-no-new-object-as-prop", rule, {
    invalid: [
        {
            code: "function View() { return <Item config={{}} />; }",
            errors: [{ messageId: "unstableObjectProp" }],
            filename,
        },
        {
            code: "function View() { const config = { dense: true }; return <Item config={config} />; }",
            errors: [{ messageId: "unstableObjectProp" }],
            filename,
        },
        {
            code: "function View({ enabled }) { return <Item config={enabled && Object()} />; }",
            errors: [{ messageId: "unstableObjectProp" }],
            filename,
        },
        {
            code: "function View() { return <Item config={new Object()} />; }",
            errors: [{ messageId: "unstableObjectProp" }],
            filename,
        },
        {
            code: "function View() { return <Item config={Object(1)} />; }",
            errors: [{ messageId: "unstableObjectProp" }],
            filename,
        },
        {
            code: "function View() { return <Item config={new Object(`value`)} />; }",
            errors: [{ messageId: "unstableObjectProp" }],
            filename,
        },
        {
            code: "function View() { return <_Item config={{}} />; }",
            errors: [{ messageId: "unstableObjectProp" }],
            filename,
            options: [{ nativeAllowList: "all" }],
        },
        {
            code: "function View() { return <section style={{}} />; }",
            errors: [{ messageId: "unstableObjectProp" }],
            filename,
            options: [{ nativeAllowList: [] }],
        },
    ],
    valid: [
        {
            code: "const config = {}; function View() { return <Item config={config} />; }",
            filename,
        },
        {
            code: "function View() { let config = {}; return <Item config={config} />; }",
            filename,
        },
        {
            code: "function View(Object) { return <Item config={Object()} />; }",
            filename,
        },
        {
            code: "const config = {}; function View() { return <Item config={Object(config)} />; }",
            filename,
        },
        {
            code: "const config = {}; function View() { return <Item config={new Object(config)} />; }",
            filename,
        },
        {
            code: "function View() { return <section style={{}} />; }",
            filename,
        },
        {
            code: "const node = <Item config={{}} />;",
            filename,
        },
    ],
});
