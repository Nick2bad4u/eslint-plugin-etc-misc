import rule from "../../src/rules/react-prefer-function-component";
import { ruleTester } from "../_internal/ruleTester";

const filename = "component.tsx";

ruleTester.run("react-prefer-function-component", rule, {
    invalid: [
        {
            code: "import { Component as Base } from 'react'; class Card extends Base { render() { return <div />; } }",
            errors: [{ messageId: "preferFunctionComponent" }],
            filename,
        },
        {
            code: "import * as R from 'react'; class Card extends R.PureComponent { render() { return null; } }",
            errors: [{ messageId: "preferFunctionComponent" }],
            filename,
        },
        {
            code: "import { PureComponent as Base } from 'preact/compat'; class Card extends Base { render() { return null; } }",
            errors: [{ messageId: "preferFunctionComponent" }],
            filename,
        },
        {
            code: "import Preact from 'preact/compat'; class Card extends Preact.Component { render() { return null; } }",
            errors: [{ messageId: "preferFunctionComponent" }],
            filename,
        },
        {
            code: "class Document { render() { return <html />; } }",
            errors: [{ messageId: "preferFunctionComponent" }],
            filename,
        },
        {
            code: "import React from 'react'; class Boundary extends React.Component { static getDerivedStateFromError() { return {}; } render() { return <div />; } }",
            errors: [{ messageId: "preferFunctionComponent" }],
            filename,
            options: [{ allowErrorBoundary: false }],
        },
        {
            code: "class JsxFactory { make() { return <div />; } }",
            errors: [{ messageId: "preferFunctionComponent" }],
            filename,
        },
    ],
    valid: [
        {
            code: "function Card() { return <div />; }",
            filename,
        },
        {
            code: "import React from 'react'; class Boundary extends React.Component { componentDidCatch() {} render() { return <div />; } }",
            filename,
        },
        {
            code: "class JsxFactory { make() { return <div />; } }",
            filename,
            options: [{ allowJsxUtilityClass: true }],
        },
        {
            code: "class Component { render() { return null; } }",
            filename,
        },
        {
            code: "import type { Component } from 'react'; class Card extends Component { render() { return null; } }",
            filename,
        },
        {
            code: "import { Component } from 'react'; function createCard(Component: new () => object) { return class Card extends Component { render() { return null; } }; }",
            filename,
        },
        {
            code: "import * as React from 'react'; function createCard(React: { Component: new () => object }) { return class Card extends React.Component { render() { return null; } }; }",
            filename,
        },
    ],
});
