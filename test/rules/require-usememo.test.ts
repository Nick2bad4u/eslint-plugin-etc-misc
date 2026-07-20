import rule from "../../src/rules/require-usememo";
import { ruleTester } from "../_internal/ruleTester";

const filename = "component.tsx";

ruleTester.run("require-usememo", rule, {
    invalid: [
        {
            code: "function View() { return <Item object={{}} array={[]} callback={() => undefined} icon={<Icon />} />; }",
            errors: [
                { messageId: "unstableProp" },
                { messageId: "unstableProp" },
                { messageId: "unstableProp" },
                { messageId: "unstableProp" },
            ],
            filename,
        },
        {
            code: "function View() { useCustom({ value: true }); return null; }",
            errors: [{ messageId: "unstableHookArgument" }],
            filename,
        },
        {
            code: "function useThing() { return { value: {} }; }",
            errors: [{ messageId: "unstableHookReturn" }],
            filename,
        },
        {
            code: "function useThing() { return {}; }",
            errors: [{ messageId: "unstableHookReturn" }],
            filename,
            options: [{ checkHookReturnObject: true }],
        },
        {
            code: "function View() { return <Item value={createValue()} />; }",
            errors: [{ messageId: "unstableProp" }],
            filename,
            options: [{ strict: true }],
        },
        {
            code: "function View() { useEffect({}); return null; }",
            errors: [{ messageId: "unstableHookArgument" }],
            filename,
            options: [{ ignoredHookCallsNames: { useEffect: false } }],
        },
        {
            code: "class Utility {} function View() { return <Item value={{}} />; }",
            errors: [{ messageId: "unstableProp" }],
            filename,
        },
        {
            code: "function View() { return <_Item value={{}} />; }",
            errors: [{ messageId: "unstableProp" }],
            filename,
        },
        {
            code: "function View(useMemo, useCallback) { return <Item value={useMemo(() => ({}), [])} callback={useCallback(() => undefined, [])} />; }",
            errors: [
                { messageId: "unstableProp" },
                { messageId: "unstableProp" },
            ],
            filename,
            options: [{ strict: true }],
        },
        {
            code: 'import { useCallback, useMemo } from "react"; function View(useMemo, useCallback) { return <Item value={useMemo(() => ({}), [])} callback={useCallback(() => undefined, [])} />; }',
            errors: [
                { messageId: "unstableProp" },
                { messageId: "unstableProp" },
            ],
            filename,
            options: [{ strict: true }],
        },
        {
            code: 'import * as React from "react"; function View(React) { return <Item value={React.useMemo(() => ({}), [])} />; }',
            errors: [{ messageId: "unstableProp" }],
            filename,
            options: [{ strict: true }],
        },
        {
            code: "const React = { useMemo: (factory) => factory() }; function View() { return <Item value={React.useMemo(() => ({}), [])} />; }",
            errors: [{ messageId: "unstableProp" }],
            filename,
            options: [{ strict: true }],
        },
        {
            code: "const useThing = () => ({ value: {} });",
            errors: [{ messageId: "unstableHookReturn" }],
            filename,
        },
        {
            code: "const useThing = () => [];",
            errors: [{ messageId: "unstableHookReturn" }],
            filename,
        },
        {
            code: "const useThing = () => <span />;",
            errors: [{ messageId: "unstableHookReturn" }],
            filename,
        },
        {
            code: "const useThing = () => ({});",
            errors: [{ messageId: "unstableHookReturn" }],
            filename,
            options: [{ checkHookReturnObject: true }],
        },
    ],
    valid: [
        {
            code: "function View() { return <div style={{}} />; }",
            filename,
        },
        {
            code: "function View() { const value = useMemo(() => ({}), []); return <Item value={value} />; }",
            filename,
        },
        {
            code: "const value = {}; function View() { return <Item value={value} />; }",
            filename,
        },
        {
            code: "function View() { return <Item unstable={{}} />; }",
            filename,
            options: [{ ignoredPropNames: ["unstable"] }],
        },
        {
            code: "function View() { useCustom({}); return null; }",
            filename,
            options: [{ ignoredHookCallsNames: { useCustom: true } }],
        },
        {
            code: "function View() { useCustom({}); return null; }",
            filename,
            options: [{ checkHookCalls: false }],
        },
        {
            code: "function View() { useEffect(() => {}, []); return null; }",
            filename,
        },
        {
            code: "const node = <Item value={{}} />;",
            filename,
        },
        {
            code: 'import { useCallback as useStableCallback, useMemo as useStableMemo } from "react"; function View() { const callback = useStableCallback(() => undefined, []); const value = useStableMemo(() => ({}), []); return <Item callback={callback} value={value} />; }',
            filename,
            options: [{ strict: true }],
        },
        {
            code: 'import { useCallback as useStableCallback, useMemo as useStableMemo } from "preact/hooks"; function View() { const callback = useStableCallback(() => undefined, []); const value = useStableMemo(() => ({}), []); return <Item callback={callback} value={value} />; }',
            filename,
            options: [{ strict: true }],
        },
        {
            code: 'import * as ReactHooks from "react"; import PreactCompat from "preact/compat"; function View() { const first = ReactHooks.useMemo(() => ({}), []); const second = PreactCompat.useCallback(() => undefined, []); return <Item first={first} second={second} />; }',
            filename,
            options: [{ strict: true }],
        },
        {
            code: 'import * as PreactHooks from "preact/hooks"; function View() { const value = PreactHooks.useMemo(() => ({}), []); return <Item value={value} />; }',
            filename,
            options: [{ strict: true }],
        },
        {
            code: 'import ReactAlias from "react"; function View() { const value = ReactAlias.useMemo(() => ({}), []); return <Item value={value} />; }',
            filename,
            options: [{ strict: true }],
        },
        {
            code: "const useThing = () => 1;",
            filename,
        },
        {
            code: "const useThing = () => ({});",
            filename,
        },
        {
            code: "const useThing = () => ({ value: 1 });",
            filename,
        },
    ],
});
