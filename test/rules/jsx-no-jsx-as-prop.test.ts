import rule from "../../src/rules/jsx-no-jsx-as-prop";
import { ruleTester } from "../_internal/ruleTester";

const filename = "component.tsx";

ruleTester.run("jsx-no-jsx-as-prop", rule, {
    invalid: [
        {
            code: "function View() { return <Item icon={<Icon />} />; }",
            errors: [{ messageId: "unstableJsxProp" }],
            filename,
        },
        {
            code: "function View() { const icon = <Icon />; return <Item icon={icon} />; }",
            errors: [{ messageId: "unstableJsxProp" }],
            filename,
        },
        {
            code: "function View({ enabled }) { return <Item icon={enabled ? <Icon /> : <></>} />; }",
            errors: [
                { messageId: "unstableJsxProp" },
                { messageId: "unstableJsxProp" },
            ],
            filename,
        },
        {
            code: "function View() { return <_Item icon={<Icon />} />; }",
            errors: [{ messageId: "unstableJsxProp" }],
            filename,
            options: [{ nativeAllowList: "all" }],
        },
        {
            code: "function View() { return <div data-icon={<Icon />} />; }",
            errors: [{ messageId: "unstableJsxProp" }],
            filename,
            options: [{ nativeAllowList: [] }],
        },
    ],
    valid: [
        {
            code: "const icon = <Icon />; function View() { return <Item icon={icon} />; }",
            filename,
        },
        {
            code: "function View() { return <div data-icon={<Icon />} />; }",
            filename,
        },
        {
            code: "function View() { return <Item><Icon /></Item>; }",
            filename,
        },
        {
            code: "const node = <Item icon={<Icon />} />;",
            filename,
        },
    ],
});
