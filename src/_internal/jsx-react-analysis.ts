import {
    AST_NODE_TYPES,
    type TSESTree as es,
    TSESLint,
} from "@typescript-eslint/utils";
import { Minimatch } from "minimatch";
import { isDefined, objectEntries, objectHasOwn, setHas } from "ts-extras";

/** JavaScript function nodes that introduce a lexical function scope. */
type FunctionNode =
    | es.ArrowFunctionExpression
    | es.FunctionDeclaration
    | es.FunctionExpression;

/** Source-code abstraction used by the shared JSX and React helpers. */
type SourceCode = TSESLint.SourceCode;

type Variable = TSESLint.Scope.Variable;

const functionNodeTypes: ReadonlySet<es.Node["type"]> = new Set([
    AST_NODE_TYPES.ArrowFunctionExpression,
    AST_NODE_TYPES.FunctionDeclaration,
    AST_NODE_TYPES.FunctionExpression,
]);

const intrinsicJsxNamePattern = /^[a-z]/v;

type JsxName = es.JSXAttribute["name"] | es.JSXOpeningElement["name"];

const getSimpleJsxName = (name: Readonly<JsxName>): string | undefined =>
    name.type === AST_NODE_TYPES.JSXIdentifier ? name.name : undefined;

/** Return whether a node introduces a JavaScript function scope. */
export const isFunctionNode = (
    node: Readonly<es.Node>
): node is Readonly<FunctionNode> => setHas(functionNodeTypes, node.type);

/** Remove transparent TypeScript and optional-chain wrappers from an expression. */
export const unwrapExpression = (
    expression: Readonly<es.Expression>
): Readonly<es.Expression> => {
    if (
        expression.type === AST_NODE_TYPES.TSAsExpression ||
        expression.type === AST_NODE_TYPES.TSNonNullExpression ||
        expression.type === AST_NODE_TYPES.TSSatisfiesExpression ||
        expression.type === AST_NODE_TYPES.TSTypeAssertion
    ) {
        return unwrapExpression(expression.expression);
    }

    if (expression.type === AST_NODE_TYPES.ChainExpression) {
        return unwrapExpression(expression.expression);
    }

    return expression;
};

/** Return a simple JSX tag name, or `undefined` for member/namespaced names. */
export const getSimpleJsxElementName = (
    node: Readonly<es.JSXOpeningElement>
): string | undefined => getSimpleJsxName(node.name);

/** React treats an ASCII-lowercase JSX identifier as a host/custom element. */
export const isIntrinsicJsxName = (name: string): boolean =>
    intrinsicJsxNamePattern.test(name);

/** Return whether an opening element is component-like rather than intrinsic. */
export const isComponentOpeningElement = (
    node: Readonly<es.JSXOpeningElement>
): boolean => {
    const name = getSimpleJsxElementName(node);

    return !isDefined(name) || !isIntrinsicJsxName(name);
};

/** Return a static JSX attribute name. */
export const getJsxAttributeName = (
    node: Readonly<es.JSXAttribute>
): string | undefined => getSimpleJsxName(node.name);

/** Find the nearest enclosing JavaScript function. */
export const getEnclosingFunction = (
    sourceCode: Readonly<SourceCode>,
    node: Readonly<es.Node>
): Readonly<FunctionNode> | undefined => {
    const ancestors = sourceCode.getAncestors(node);

    for (let index = ancestors.length - 1; index >= 0; index -= 1) {
        const ancestor = ancestors[index];

        if (isDefined(ancestor) && isFunctionNode(ancestor)) {
            return ancestor;
        }
    }

    return undefined;
};

/** Find a lexical variable by walking the scope chain. */
export const findVariable = (
    sourceCode: Readonly<SourceCode>,
    identifier: Readonly<es.Identifier>
): Readonly<Variable> | undefined => {
    let scope: null | TSESLint.Scope.Scope = sourceCode.getScope(identifier);

    while (scope !== null) {
        const variable = scope.set.get(identifier.name);

        if (isDefined(variable)) {
            return variable;
        }

        scope = scope.upper;
    }

    return undefined;
};

/**
 * Resolve an identifier only when it has one `const` declarator in the same
 * function. Module constants and mutable/control-flow-dependent bindings are
 * deliberately excluded.
 */
export const getSameFunctionConstInitializer = (
    sourceCode: Readonly<SourceCode>,
    identifier: Readonly<es.Identifier>
): Readonly<es.Expression> | undefined => {
    const variable = findVariable(sourceCode, identifier);

    if (!isDefined(variable) || variable.defs.length !== 1) {
        return undefined;
    }

    const [definition] = variable.defs;

    if (
        definition?.type !== TSESLint.Scope.DefinitionType.Variable ||
        definition.node.id.type !== AST_NODE_TYPES.Identifier ||
        definition.node.id.name !== identifier.name ||
        definition.node.init === null ||
        definition.node.parent.kind !== "const"
    ) {
        return undefined;
    }

    const useFunction = getEnclosingFunction(sourceCode, identifier);
    const declarationFunction = getEnclosingFunction(
        sourceCode,
        definition.node
    );

    if (useFunction !== declarationFunction || !isDefined(useFunction)) {
        return undefined;
    }

    return definition.node.init;
};

const isNode = (value: unknown): value is Readonly<es.Node> =>
    typeof value === "object" &&
    value !== null &&
    objectHasOwn(value, "type") &&
    typeof value.type === "string";

const getChildNodes = (
    sourceCode: Readonly<SourceCode>,
    node: Readonly<es.Node>
): readonly Readonly<es.Node>[] => {
    const visitorKeys = sourceCode.visitorKeys[node.type] ?? [];
    const childNodes: Readonly<es.Node>[] = [];

    const addNode = (value: unknown): void => {
        if (isNode(value)) {
            childNodes.push(value);
        }
    };

    for (const visitorKey of visitorKeys) {
        const value: unknown = Reflect.get(node, visitorKey);

        if (Array.isArray(value)) {
            for (const item of value) {
                addNode(item);
            }

            continue;
        }

        addNode(value);
    }

    return childNodes;
};

/** Return whether a function directly contains JSX, excluding nested functions. */
export const functionContainsJsx = (
    sourceCode: Readonly<SourceCode>,
    node: Readonly<FunctionNode>
): boolean => {
    if (
        node.body.type === AST_NODE_TYPES.JSXElement ||
        node.body.type === AST_NODE_TYPES.JSXFragment
    ) {
        return true;
    }

    const stack: es.Node[] = [...getChildNodes(sourceCode, node.body)];

    while (stack.length > 0) {
        const current = stack.pop();

        if (isDefined(current)) {
            if (
                current.type === AST_NODE_TYPES.JSXElement ||
                current.type === AST_NODE_TYPES.JSXFragment
            ) {
                return true;
            }

            if (!isFunctionNode(current)) {
                stack.push(...getChildNodes(sourceCode, current));
            }
        }
    }

    return false;
};

/** Return a statically known class member name. */
export const getStaticClassMemberName = (
    node: Readonly<es.MethodDefinition | es.PropertyDefinition>
): string | undefined => {
    if (node.key.type === AST_NODE_TYPES.Identifier && !node.computed) {
        return node.key.name;
    }

    if (
        node.key.type === AST_NODE_TYPES.Literal &&
        typeof node.key.value === "string"
    ) {
        return node.key.value;
    }

    return undefined;
};

/** Return the static terminal name of a direct/member call. */
export const getCallName = (
    node: Readonly<es.CallExpression>
): string | undefined => {
    const callee = unwrapExpression(node.callee);

    if (callee.type === AST_NODE_TYPES.Identifier) {
        return callee.name;
    }

    if (
        callee.type === AST_NODE_TYPES.MemberExpression &&
        !callee.computed &&
        callee.property.type === AST_NODE_TYPES.Identifier
    ) {
        return callee.property.name;
    }

    return undefined;
};

/** Return whether a name follows React's conventional component casing. */
export const isComponentName = (name: string): boolean => {
    const firstCharacter = name.at(0);

    return (
        firstCharacter?.toUpperCase() === firstCharacter &&
        firstCharacter?.toLowerCase() !== firstCharacter
    );
};

/** Return whether a name follows the conventional custom-hook shape. */
export const isHookName = (name: string): boolean =>
    name === "use" || /^use[0-9A-Z]/v.test(name);

/** Resolve an exact/glob boolean policy. Exact entries take precedence. */
export const getNamePolicy = (
    name: string,
    policies: Readonly<Record<string, boolean>>
): boolean | undefined => {
    if (objectHasOwn(policies, name)) {
        return policies[name];
    }

    for (const [pattern, policy] of objectEntries(policies)) {
        const minimatch = new Minimatch(pattern);

        if (minimatch.match(name)) {
            return policy;
        }
    }

    return undefined;
};

/** Return whether an identifier is not shadowed by a local declaration. */
export const isUnshadowedGlobalIdentifier = (
    sourceCode: Readonly<SourceCode>,
    identifier: Readonly<es.Identifier>
): boolean => {
    const variable = findVariable(sourceCode, identifier);

    return !isDefined(variable) || variable.defs.length === 0;
};

export type { FunctionNode, SourceCode };
