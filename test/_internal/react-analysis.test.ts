import parser from "@typescript-eslint/parser";
import {
    AST_NODE_TYPES,
    type TSESTree as es,
    TSESLint,
} from "@typescript-eslint/utils";
import { describe, expect, it } from "vitest";

import {
    isBindCall,
    isBuiltinAllocation,
} from "../../src/_internal/jsx-prop-stability";
import {
    findVariable,
    functionContainsJsx,
    getCallName,
    getEnclosingFunction,
    getJsxAttributeName,
    getNamePolicy,
    getSameFunctionConstInitializer,
    getSimpleJsxElementName,
    getStaticClassMemberName,
    isComponentName,
    isComponentOpeningElement,
    isFunctionNode,
    isHookName,
    isIntrinsicJsxName,
    isUnshadowedGlobalIdentifier,
    unwrapExpression,
} from "../../src/_internal/jsx-react-analysis";
import {
    collectUnstableValues,
    isMemoHookCall,
} from "../../src/_internal/react-memo-stability";

type ParsedSource = Readonly<{
    nodes: readonly es.Node[];
    sourceCode: TSESLint.SourceCode;
}>;

type VisitorKeys = Readonly<Record<string, readonly string[] | undefined>>;

const isNode = (value: unknown): value is es.Node =>
    typeof value === "object" &&
    value !== null &&
    typeof Reflect.get(value, "type") === "string";

const connectParentsAndCollect = (
    node: es.Node,
    parent: es.Node | undefined,
    visitorKeys: VisitorKeys,
    nodes: es.Node[]
): void => {
    if (parent !== undefined) {
        Object.defineProperty(node, "parent", {
            configurable: true,
            value: parent,
        });
    }

    nodes.push(node);

    const childVisitorKeys = visitorKeys[node.type] ?? [];

    for (const visitorKey of childVisitorKeys) {
        const value: unknown = Reflect.get(node, visitorKey);

        if (Array.isArray(value)) {
            for (const item of value) {
                connectNodeIfPresent(item, node, visitorKeys, nodes);
            }
        } else {
            connectNodeIfPresent(value, node, visitorKeys, nodes);
        }
    }
};

const connectNodeIfPresent = (
    value: unknown,
    parent: Readonly<es.Node>,
    visitorKeys: Readonly<VisitorKeys>,
    nodes: es.Node[]
): void => {
    if (isNode(value)) {
        connectParentsAndCollect(value, parent, visitorKeys, nodes);
    }
};

const normalizeVisitorKeys = (
    visitorKeys: VisitorKeys
): TSESLint.SourceCode.VisitorKeys => {
    const normalizedVisitorKeys: Record<string, readonly string[]> = {};

    for (const [nodeType, childKeys] of Object.entries(visitorKeys)) {
        if (childKeys !== undefined) {
            normalizedVisitorKeys[nodeType] = childKeys;
        }
    }

    return normalizedVisitorKeys;
};

const parseSource = (text: string): ParsedSource => {
    const parsed = parser.parseForESLint(text, {
        comment: true,
        ecmaFeatures: { jsx: true },
        ecmaVersion: "latest",
        loc: true,
        range: true,
        sourceType: "module",
        tokens: true,
    });
    const visitorKeys = normalizeVisitorKeys(parsed.visitorKeys);
    const nodes: es.Node[] = [];

    connectParentsAndCollect(parsed.ast, undefined, visitorKeys, nodes);

    return {
        nodes,
        sourceCode: new TSESLint.SourceCode({
            ast: parsed.ast,
            parserServices: parsed.services,
            scopeManager: parsed.scopeManager,
            text,
            visitorKeys,
        }),
    };
};

const getNodes = <Node extends es.Node>(
    parsed: Readonly<ParsedSource>,
    predicate: (node: Readonly<es.Node>) => node is Node
): readonly Node[] => parsed.nodes.filter(predicate);

const getArrayElement = <Value>(
    values: readonly Value[],
    index: number,
    description: string
): Value => {
    const value = values[index];

    expect(value, `Expected ${description}.`).toBeDefined();

    if (value === undefined) {
        throw new TypeError(`Expected ${description}.`);
    }

    return value;
};

const getNode = <Node extends es.Node>(
    parsed: Readonly<ParsedSource>,
    predicate: (node: Readonly<es.Node>) => node is Node,
    description: string
): Node => {
    const node = parsed.nodes.find(predicate);

    expect(node, `Expected to parse ${description}.`).toBeDefined();

    if (node === undefined) {
        throw new TypeError(`Expected to parse ${description}.`);
    }

    return node;
};

const getNodeByText = <Node extends es.Node>(
    parsed: Readonly<ParsedSource>,
    predicate: (node: Readonly<es.Node>) => node is Node,
    text: string
): Node => {
    const node = parsed.nodes.find(
        (candidate): candidate is Node =>
            predicate(candidate) &&
            parsed.sourceCode.getText(candidate) === text
    );

    expect(node, `Expected to parse node: ${text}`).toBeDefined();

    if (node === undefined) {
        throw new TypeError(`Expected to parse node: ${text}`);
    }

    return node;
};

const isCallExpression = (node: Readonly<es.Node>): node is es.CallExpression =>
    node.type === AST_NODE_TYPES.CallExpression;

const isIdentifier = (node: Readonly<es.Node>): node is es.Identifier =>
    node.type === AST_NODE_TYPES.Identifier;

describe("shared JSX and React AST analysis", () => {
    it("classifies names and resolves exact and glob policies", () => {
        expect.hasAssertions();

        expect(isIntrinsicJsxName("div")).toBe(true);
        expect(isIntrinsicJsxName("my-element")).toBe(true);
        expect(isIntrinsicJsxName("Card")).toBe(false);
        expect(isComponentName("Card")).toBe(true);
        expect(isComponentName("_Card")).toBe(false);
        expect(isComponentName("")).toBe(false);
        expect(isHookName("use")).toBe(true);
        expect(isHookName("use2D")).toBe(true);
        expect(isHookName("user")).toBe(false);
        expect(
            getNamePolicy("InternalCard", {
                "Internal*": true,
                InternalCard: false,
            })
        ).toBe(false);
        expect(getNamePolicy("InternalPanel", { "Internal*": true })).toBe(
            true
        );
        expect(
            getNamePolicy("PublicCard", { "Internal*": true })
        ).toBeUndefined();
    });

    it("reads JSX, class-member, call, and transparent wrapper shapes", () => {
        expect.hasAssertions();

        const parsed = parseSource(`
            const value = source?.method;
            (callback as () => void)();
            direct();
            object.method();
            object[methodName]();
            class Example {
                render() {}
                ["computed"]() {}
                [methodName]() {}
            }
            const node = <><div data-id="x" /><Namespace.Widget xml:lang="en" /></>;
        `);
        const openingElements = getNodes(
            parsed,
            (node): node is es.JSXOpeningElement =>
                node.type === AST_NODE_TYPES.JSXOpeningElement
        );
        const attributes = getNodes(
            parsed,
            (node): node is es.JSXAttribute =>
                node.type === AST_NODE_TYPES.JSXAttribute
        );
        const methods = getNodes(
            parsed,
            (node): node is es.MethodDefinition =>
                node.type === AST_NODE_TYPES.MethodDefinition
        );
        const chains = getNodes(
            parsed,
            (node): node is es.ChainExpression =>
                node.type === AST_NODE_TYPES.ChainExpression
        );
        const intrinsicOpeningElement = getArrayElement(
            openingElements,
            0,
            "an intrinsic JSX opening element"
        );
        const componentOpeningElement = getArrayElement(
            openingElements,
            1,
            "a component JSX opening element"
        );
        const staticAttribute = getArrayElement(
            attributes,
            0,
            "a static JSX attribute"
        );
        const namespacedAttribute = getArrayElement(
            attributes,
            1,
            "a namespaced JSX attribute"
        );
        const identifierMethod = getArrayElement(
            methods,
            0,
            "an identifier-named class method"
        );
        const literalMethod = getArrayElement(
            methods,
            1,
            "a literal-named class method"
        );
        const dynamicMethod = getArrayElement(
            methods,
            2,
            "a dynamically named class method"
        );
        const chain = getArrayElement(chains, 0, "an optional chain");

        expect(getSimpleJsxElementName(intrinsicOpeningElement)).toBe("div");
        expect(isComponentOpeningElement(intrinsicOpeningElement)).toBe(false);
        expect(
            getSimpleJsxElementName(componentOpeningElement)
        ).toBeUndefined();
        expect(isComponentOpeningElement(componentOpeningElement)).toBe(true);
        expect(getJsxAttributeName(staticAttribute)).toBe("data-id");
        expect(getJsxAttributeName(namespacedAttribute)).toBeUndefined();
        expect(getStaticClassMemberName(identifierMethod)).toBe("render");
        expect(getStaticClassMemberName(literalMethod)).toBe("computed");
        expect(getStaticClassMemberName(dynamicMethod)).toBeUndefined();
        expect(
            getCallName(getNodeByText(parsed, isCallExpression, "direct()"))
        ).toBe("direct");
        expect(
            getCallName(
                getNodeByText(parsed, isCallExpression, "object.method()")
            )
        ).toBe("method");
        expect(
            getCallName(
                getNodeByText(parsed, isCallExpression, "object[methodName]()")
            )
        ).toBeUndefined();
        expect(
            getCallName(
                getNodeByText(
                    parsed,
                    isCallExpression,
                    "(callback as () => void)()"
                )
            )
        ).toBe("callback");
        expect(unwrapExpression(chain)).not.toBe(chain);
    });

    it("tracks function boundaries, lexical variables, and direct JSX", () => {
        expect.hasAssertions();

        const parsed = parseSource(`
            const moduleValue = {};
            function WithJsx() {
                const localValue = {};
                const mutableValue = {};
                function Nested() { return <span>{localValue}</span>; }
                return <div>{localValue}</div>;
            }
            function NestedOnly() {
                return () => <span />;
            }
            function Plain() { return moduleValue; }
            void missingGlobal;
        `);
        const functions = getNodes(
            parsed,
            (node): node is es.FunctionDeclaration =>
                node.type === AST_NODE_TYPES.FunctionDeclaration
        );
        const localReferences = parsed.nodes.filter(
            (node): node is es.Identifier =>
                isIdentifier(node) &&
                node.name === "localValue" &&
                node.parent.type === AST_NODE_TYPES.JSXExpressionContainer
        );
        const withJsx = getArrayElement(
            functions,
            0,
            "the JSX-returning function"
        );
        const nested = getArrayElement(functions, 1, "the nested function");
        const nestedOnly = getArrayElement(
            functions,
            2,
            "the nested-JSX-only function"
        );
        const plain = getArrayElement(functions, 3, "the plain function");
        const nestedReference = getArrayElement(
            localReferences,
            0,
            "the nested local reference"
        );
        const outerReference = getArrayElement(
            localReferences,
            1,
            "the outer local reference"
        );
        const moduleReference = getNode(
            parsed,
            (node): node is es.Identifier =>
                isIdentifier(node) &&
                node.name === "moduleValue" &&
                node.parent.type === AST_NODE_TYPES.ReturnStatement,
            "the module-value reference"
        );
        const missingReference = getNode(
            parsed,
            (node): node is es.Identifier =>
                isIdentifier(node) && node.name === "missingGlobal",
            "the unresolved global reference"
        );

        expect(functionContainsJsx(parsed.sourceCode, withJsx)).toBe(true);
        expect(functionContainsJsx(parsed.sourceCode, nestedOnly)).toBe(false);
        expect(functionContainsJsx(parsed.sourceCode, plain)).toBe(false);
        expect(isFunctionNode(withJsx)).toBe(true);
        expect(isFunctionNode(parsed.sourceCode.ast)).toBe(false);
        expect(getEnclosingFunction(parsed.sourceCode, nestedReference)).toBe(
            nested
        );
        expect(getEnclosingFunction(parsed.sourceCode, outerReference)).toBe(
            withJsx
        );
        expect(findVariable(parsed.sourceCode, outerReference)?.name).toBe(
            "localValue"
        );
        expect(
            getSameFunctionConstInitializer(parsed.sourceCode, outerReference)
                ?.type
        ).toBe(AST_NODE_TYPES.ObjectExpression);
        expect(
            getSameFunctionConstInitializer(parsed.sourceCode, moduleReference)
        ).toBeUndefined();
        expect(
            findVariable(parsed.sourceCode, missingReference)
        ).toBeUndefined();
        expect(
            getSameFunctionConstInitializer(parsed.sourceCode, missingReference)
        ).toBeUndefined();
        expect(
            isUnshadowedGlobalIdentifier(parsed.sourceCode, missingReference)
        ).toBe(true);
        expect(
            isUnshadowedGlobalIdentifier(parsed.sourceCode, outerReference)
        ).toBe(false);
    });
});

describe("render-local JSX prop stability", () => {
    it("recognizes built-in allocations without confusing identity calls", () => {
        expect.hasAssertions();

        const parsed = parseSource(`
            function View(condition, value, values) {
                Array();
                new Function();
                Object();
                Object(condition ? 1 : 2);
                Object(condition ? 1 : value);
                Object(1 && 2);
                Object((condition, 1));
                Object(source.value);
                Object(...values);
                Namespace.Object();
            }
            function Shadowed(Object, Array, Function) {
                Object("shadowed"); Array(1); new Function("return 1");
            }
        `);
        const callByText = (text: string): es.CallExpression =>
            getNodeByText(parsed, isCallExpression, text);

        expect(
            isBuiltinAllocation(
                callByText("Array()"),
                parsed.sourceCode,
                "Array"
            )
        ).toBe(true);
        expect(
            isBuiltinAllocation(
                getNodeByText(
                    parsed,
                    (node): node is es.NewExpression =>
                        node.type === AST_NODE_TYPES.NewExpression,
                    "new Function()"
                ),
                parsed.sourceCode,
                "Function"
            )
        ).toBe(true);

        for (const text of [
            "Object()",
            "Object(condition ? 1 : 2)",
            "Object(1 && 2)",
            "Object((condition, 1))",
        ]) {
            expect(
                isBuiltinAllocation(
                    callByText(text),
                    parsed.sourceCode,
                    "Object"
                )
            ).toBe(true);
        }

        for (const text of [
            "Object(condition ? 1 : value)",
            "Object(source.value)",
            "Object(...values)",
            "Namespace.Object()",
        ]) {
            expect(
                isBuiltinAllocation(
                    callByText(text),
                    parsed.sourceCode,
                    "Object"
                )
            ).toBe(false);
        }

        expect(
            isBuiltinAllocation(
                callByText('Object("shadowed")'),
                parsed.sourceCode,
                "Object"
            )
        ).toBe(false);
        expect(
            isBuiltinAllocation(
                callByText("Array(1)"),
                parsed.sourceCode,
                "Array"
            )
        ).toBe(false);
        expect(
            isBuiltinAllocation(
                getNodeByText(
                    parsed,
                    (node): node is es.NewExpression =>
                        node.type === AST_NODE_TYPES.NewExpression,
                    'new Function("return 1")'
                ),
                parsed.sourceCode,
                "Function"
            )
        ).toBe(false);
    });

    it("recognizes dot and static-computed bind calls", () => {
        expect.hasAssertions();

        const parsed = parseSource(`
            handler.bind(null);
            handler["bind"](null);
            handler[methodName](null);
            bind(null);
        `);

        expect(
            isBindCall(
                getNodeByText(parsed, isCallExpression, "handler.bind(null)")
            )
        ).toBe(true);
        expect(
            isBindCall(
                getNodeByText(parsed, isCallExpression, 'handler["bind"](null)')
            )
        ).toBe(true);
        expect(
            isBindCall(
                getNodeByText(
                    parsed,
                    isCallExpression,
                    "handler[methodName](null)"
                )
            )
        ).toBe(false);
        expect(
            isBindCall(getNodeByText(parsed, isCallExpression, "bind(null)"))
        ).toBe(false);
    });
});

describe("react memo stability", () => {
    it("resolves only value imports from supported React and Preact modules", () => {
        expect.hasAssertions();

        const parsed = parseSource(`
            import ReactDefault, * as ReactNamespace from "react";
            import { useCallback, useMemo as memoHook, "useMemo" as stringMemo } from "react";
            import type { useMemo as typeMemo } from "react";
            import { useMemo as otherMemo } from "other-library";
            memoHook(() => ({}), []);
            stringMemo(() => ({}), []);
            useCallback(() => undefined, []);
            ReactDefault.useMemo(() => ({}), []);
            ReactNamespace["useCallback"](() => undefined, []);
            ReactNamespace[hookName](() => undefined, []);
            getReact().useMemo(() => ({}), []);
            ReactNamespace.useEffect(() => undefined, []);
            typeMemo(() => ({}), []);
            otherMemo(() => ({}), []);
        `);
        const stableCalls = [
            "memoHook(() => ({}), [])",
            "stringMemo(() => ({}), [])",
            "useCallback(() => undefined, [])",
            "ReactDefault.useMemo(() => ({}), [])",
            'ReactNamespace["useCallback"](() => undefined, [])',
        ];
        const unstableCalls = [
            "getReact().useMemo(() => ({}), [])",
            "ReactNamespace[hookName](() => undefined, [])",
            "ReactNamespace.useEffect(() => undefined, [])",
            "typeMemo(() => ({}), [])",
            "otherMemo(() => ({}), [])",
        ];

        for (const text of stableCalls) {
            expect(
                isMemoHookCall(
                    parsed.sourceCode,
                    getNodeByText(parsed, isCallExpression, text)
                )
            ).toBe(true);
        }

        for (const text of unstableCalls) {
            expect(
                isMemoHookCall(
                    parsed.sourceCode,
                    getNodeByText(parsed, isCallExpression, text)
                )
            ).toBe(false);
        }

        expect(
            isMemoHookCall(
                parsed.sourceCode,
                getNodeByText(
                    parsed,
                    (node): node is es.ArrayExpression =>
                        node.type === AST_NODE_TYPES.ArrayExpression,
                    "[]"
                )
            )
        ).toBe(false);
    });

    it("collects direct, composed, aliased, unknown, and cyclic values", () => {
        expect.hasAssertions();

        const parsed = parseSource(`
            function View(condition, source, tag) {
                const objectValue = {};
                const arrayValue = [];
                const instanceValue = new Date();
                const functionValue = function () {};
                const jsxValue = <span />;
                const fragmentValue = <></>;
                const logicalValue = condition && [];
                const conditionalValue = condition ? {} : [];
                const sequenceValue = (0, {});
                const unknownCall = createValue();
                const unknownMember = source.value;
                const unknownTag = tag\`value\`;
                const duplicate = condition ? objectValue : objectValue;
                const firstCycle = secondCycle;
                const secondCycle = firstCycle;
                return [
                    objectValue,
                    arrayValue,
                    instanceValue,
                    functionValue,
                    jsxValue,
                    fragmentValue,
                    logicalValue,
                    conditionalValue,
                    sequenceValue,
                    unknownCall,
                    unknownMember,
                    unknownTag,
                    duplicate,
                    firstCycle,
                ];
            }
        `);
        const returnArray = getNode(
            parsed,
            (node): node is es.ArrayExpression =>
                node.type === AST_NODE_TYPES.ArrayExpression &&
                node.parent.type === AST_NODE_TYPES.ReturnStatement,
            "the component's return array"
        );

        const references = returnArray.elements.filter(
            (element): element is es.Identifier =>
                element?.type === AST_NODE_TYPES.Identifier
        );
        const getReference = (name: string): es.Identifier => {
            const reference = references.find(
                (candidate) => candidate.name === name
            );

            expect(reference, `Expected reference: ${name}`).toBeDefined();

            if (reference === undefined) {
                throw new TypeError(`Expected reference: ${name}`);
            }

            return reference;
        };
        const kindsByReference = Object.fromEntries(
            references.map((reference) => [
                reference.name,
                collectUnstableValues(parsed.sourceCode, reference, true).map(
                    ({ kind }) => kind
                ),
            ])
        );

        expect(kindsByReference).toStrictEqual({
            arrayValue: ["array"],
            conditionalValue: ["object", "array"],
            duplicate: ["object"],
            firstCycle: [],
            fragmentValue: ["jsx"],
            functionValue: ["function"],
            instanceValue: ["instance"],
            jsxValue: ["jsx"],
            logicalValue: ["array"],
            objectValue: ["object"],
            sequenceValue: ["object"],
            unknownCall: ["unknown"],
            unknownMember: ["unknown"],
            unknownTag: ["unknown"],
        });
        expect(
            collectUnstableValues(
                parsed.sourceCode,
                getReference("unknownCall"),
                false
            )
        ).toStrictEqual([]);

        const objectInitializer = getNodeByText(
            parsed,
            (node): node is es.ObjectExpression =>
                node.type === AST_NODE_TYPES.ObjectExpression,
            "{}"
        );

        expect(
            collectUnstableValues(
                parsed.sourceCode,
                objectInitializer,
                true,
                new Set([objectInitializer])
            )
        ).toStrictEqual([]);
    });
});
