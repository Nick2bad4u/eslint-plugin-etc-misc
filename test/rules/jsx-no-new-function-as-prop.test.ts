import rule from "../../src/rules/jsx-no-new-function-as-prop";
import { ruleTester } from "../_internal/ruleTester";

const filename = "component.tsx";

ruleTester.run("jsx-no-new-function-as-prop", rule, {
    invalid: [
        {
            code: "function View() { return <Item onClick={() => undefined} />; }",
            errors: [{ messageId: "unstableFunctionProp" }],
            filename,
        },
        {
            code: "function View() { const handler = function () {}; return <Item onClick={handler} />; }",
            errors: [{ messageId: "unstableFunctionProp" }],
            filename,
        },
        {
            code: "function View({ handler }) { return <Item onClick={handler.bind(null)} />; }",
            errors: [{ messageId: "unstableFunctionProp" }],
            filename,
        },
        {
            code: "function View() { return <Item onClick={new Function()} />; }",
            errors: [{ messageId: "unstableFunctionProp" }],
            filename,
        },
        {
            code: "function View({ enabled }) { return <Item onClick={enabled ? () => 1 : function () { return 2; }} />; }",
            errors: [
                { messageId: "unstableFunctionProp" },
                { messageId: "unstableFunctionProp" },
            ],
            filename,
        },
        {
            code: "function View() { return <_Item onClick={() => undefined} />; }",
            errors: [{ messageId: "unstableFunctionProp" }],
            filename,
            options: [{ nativeAllowList: "all" }],
        },
        {
            code: "function View() { return <button onClick={() => undefined} />; }",
            errors: [{ messageId: "unstableFunctionProp" }],
            filename,
            options: [{ nativeAllowList: [] }],
        },
    ],
    valid: [
        {
            code: "const handler = () => undefined; function View() { return <Item onClick={handler} />; }",
            filename,
        },
        {
            code: "function View(Function) { return <Item onClick={Function()} />; }",
            filename,
        },
        {
            code: "function View() { return <button onClick={() => undefined} />; }",
            filename,
        },
        {
            code: "const node = <Item onClick={() => undefined} />;",
            filename,
        },
    ],
});
