import rule from "../../src/rules/require-usememo-children";
import { ruleTester } from "../_internal/ruleTester";

const filename = "component.tsx";

ruleTester.run("require-usememo-children", rule, {
    invalid: [
        {
            code: "function View() { return <Panel><span /></Panel>; }",
            errors: [{ messageId: "unstableChild" }],
            filename,
        },
        {
            code: "function View() { return <Panel><><span /></></Panel>; }",
            errors: [{ messageId: "unstableChild" }],
            filename,
        },
        {
            code: "function View() { return <Panel>{[]}{() => undefined}</Panel>; }",
            errors: [
                { messageId: "unstableChild" },
                { messageId: "unstableChild" },
            ],
            filename,
        },
        {
            code: "function View() { const child = <span />; return <Panel>{child}</Panel>; }",
            errors: [{ messageId: "unstableChild" }],
            filename,
        },
        {
            code: "function View() { return <Panel>{createChild()}</Panel>; }",
            errors: [{ messageId: "unstableChild" }],
            filename,
            options: [{ strict: true }],
        },
        {
            code: "class Utility {} function View() { return <Panel>{{}}</Panel>; }",
            errors: [{ messageId: "unstableChild" }],
            filename,
        },
        {
            code: "function View() { return <_Panel><span /></_Panel>; }",
            errors: [{ messageId: "unstableChild" }],
            filename,
        },
        {
            code: "function View(useMemo, useCallback) { return <Panel>{useMemo(() => <span />, [])}{useCallback(() => undefined, [])}</Panel>; }",
            errors: [
                { messageId: "unstableChild" },
                { messageId: "unstableChild" },
            ],
            filename,
            options: [{ strict: true }],
        },
        {
            code: 'import { useCallback, useMemo } from "react"; function View(useMemo, useCallback) { return <Panel>{useMemo(() => <span />, [])}{useCallback(() => undefined, [])}</Panel>; }',
            errors: [
                { messageId: "unstableChild" },
                { messageId: "unstableChild" },
            ],
            filename,
            options: [{ strict: true }],
        },
        {
            code: 'import * as React from "react"; function View(React) { return <Panel>{React.useMemo(() => <span />, [])}</Panel>; }',
            errors: [{ messageId: "unstableChild" }],
            filename,
            options: [{ strict: true }],
        },
        {
            code: "const React = { useMemo: (factory) => factory() }; function View() { return <Panel>{React.useMemo(() => <span />, [])}</Panel>; }",
            errors: [{ messageId: "unstableChild" }],
            filename,
            options: [{ strict: true }],
        },
    ],
    valid: [
        {
            code: "function View() { return <div><span /></div>; }",
            filename,
        },
        {
            code: "function View({ child }) { return <Panel>{child}</Panel>; }",
            filename,
        },
        {
            code: "function View() { return <Panel>text{1}{null}</Panel>; }",
            filename,
        },
        {
            code: "const child = <span />; function View() { return <Panel>{child}</Panel>; }",
            filename,
        },
        {
            code: "function View() { const child = useMemo(() => <span />, []); return <Panel>{child}</Panel>; }",
            filename,
        },
        {
            code: "const node = <Panel><span /></Panel>;",
            filename,
        },
        {
            code: 'import { useCallback as useStableCallback, useMemo as useStableMemo } from "react"; function View() { const callback = useStableCallback(() => undefined, []); const child = useStableMemo(() => <span />, []); return <Panel>{child}{callback}</Panel>; }',
            filename,
            options: [{ strict: true }],
        },
        {
            code: 'import { useMemo as useStableMemo } from "preact/hooks"; function View() { const child = useStableMemo(() => <span />, []); return <Panel>{child}</Panel>; }',
            filename,
            options: [{ strict: true }],
        },
        {
            code: 'import * as ReactHooks from "react"; import PreactCompat from "preact/compat"; function View() { const first = ReactHooks.useMemo(() => <span />, []); const second = PreactCompat.useCallback(() => undefined, []); return <Panel>{first}{second}</Panel>; }',
            filename,
            options: [{ strict: true }],
        },
        {
            code: 'import * as PreactHooks from "preact/hooks"; function View() { const child = PreactHooks.useMemo(() => <span />, []); return <Panel>{child}</Panel>; }',
            filename,
            options: [{ strict: true }],
        },
        {
            code: 'import ReactAlias from "react"; function View() { const child = ReactAlias.useMemo(() => <span />, []); return <Panel>{child}</Panel>; }',
            filename,
            options: [{ strict: true }],
        },
    ],
});
