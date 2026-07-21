import rule from "../../src/rules/jsx-no-new-array-as-prop";
import { ruleTester } from "../_internal/ruleTester";

const filename = "component.tsx";

ruleTester.run("jsx-no-new-array-as-prop", rule, {
    invalid: [
        {
            code: "function View() { return <Item values={[]} />; }",
            errors: [{ messageId: "unstableArrayProp" }],
            filename,
        },
        {
            code: "function View() { const values = [1, 2] as const; return <Item values={values} />; }",
            errors: [{ messageId: "unstableArrayProp" }],
            filename,
        },
        {
            code: "function View({ enabled }) { return <Item values={enabled ? [] : Array()} />; }",
            errors: [
                { messageId: "unstableArrayProp" },
                { messageId: "unstableArrayProp" },
            ],
            filename,
        },
        {
            code: "function View() { return <Item values={new Array()} />; }",
            errors: [{ messageId: "unstableArrayProp" }],
            filename,
        },
        {
            code: "function View() { return <div data-items={[]} />; }",
            errors: [{ messageId: "unstableArrayProp" }],
            filename,
            options: [{ nativeAllowList: [] }],
        },
        {
            code: "function View() { return <_Item values={[]} />; }",
            errors: [{ messageId: "unstableArrayProp" }],
            filename,
            options: [{ nativeAllowList: "all" }],
        },
        {
            code: "function View() { const values = []; return <Item first={values} second={values} />; }",
            errors: [{ messageId: "unstableArrayProp" }],
            filename,
        },
        {
            code: "function View() { return <Item values={(0, [])} />; }",
            errors: [{ messageId: "unstableArrayProp" }],
            filename,
        },
    ],
    valid: [
        {
            code: "const values = []; function View() { return <Item values={values} />; }",
            filename,
        },
        {
            code: "function View() { let values = []; return <Item values={values} />; }",
            filename,
        },
        {
            code: "function View(Array) { return <Item values={Array()} />; }",
            filename,
        },
        {
            code: "function View() { return <div data-items={[]} />; }",
            filename,
        },
        {
            code: "function View() { return <div data-items={[]} other={[]} />; }",
            filename,
            options: [{ nativeAllowList: ["DATA-ITEMS", "other"] }],
        },
        {
            code: "const node = <Item values={[]} />;",
            filename,
        },
        {
            code: "function View() { const first = second; const second = first; return <Item values={first} />; }",
            filename,
        },
        {
            code: "function View() { return <Item values={/* intentionally empty */} />; }",
            filename,
        },
    ],
});
