import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import globals from "globals";
import {
    arrayFirst,
    assertNever,
    isDefined,
    objectHasOwn,
    objectKeys,
    setHas,
} from "ts-extras";

import { ruleCreator } from "./rule-creator.js";

/** Execution phase whose eager browser-global accesses a rule reports. */
type ExecutionContext =
    | "constructor"
    | "module"
    | "react-class-render"
    | "react-function-component";

type FunctionNode =
    | es.ArrowFunctionExpression
    | es.FunctionDeclaration
    | es.FunctionExpression;

type MessageIds = "forbidden";

type Options = readonly [];

type SourceCode = TSESLint.SourceCode;

const browserOnlyGlobalNames: ReadonlySet<string> = new Set(
    objectKeys(globals.browser).filter(
        (name) => !objectHasOwn(globals.node, name)
    )
);

const functionNodeTypes: ReadonlySet<es.Node["type"]> = new Set([
    AST_NODE_TYPES.ArrowFunctionExpression,
    AST_NODE_TYPES.FunctionDeclaration,
    AST_NODE_TYPES.FunctionExpression,
]);

const transparentTypeScriptNodeTypes: ReadonlySet<string> = new Set([
    "TSAsExpression",
    "TSInstantiationExpression",
    "TSNonNullExpression",
    "TSParameterProperty",
    "TSSatisfiesExpression",
    "TSTypeAssertion",
]);

const isNode = (value: unknown): value is Readonly<es.Node> =>
    typeof value === "object" && value !== null && objectHasOwn(value, "type");

const isFunctionNode = (
    node: Readonly<es.Node>
): node is Readonly<FunctionNode> => setHas(functionNodeTypes, node.type);

const isBrowserOnlyGlobalName = (name: string): boolean =>
    setHas(browserOnlyGlobalNames, name);

const getStaticMemberName = (
    node: Readonly<es.MemberExpression>
): string | undefined => {
    if (!node.computed && node.property.type === AST_NODE_TYPES.Identifier) {
        return node.property.name;
    }

    if (
        node.computed &&
        node.property.type === AST_NODE_TYPES.Literal &&
        typeof node.property.value === "string"
    ) {
        return node.property.value;
    }

    return undefined;
};

const isReferenceIdentifier = (
    sourceCode: Readonly<SourceCode>,
    identifier: Readonly<es.Identifier>
): boolean => {
    let scope: null | TSESLint.Scope.Scope = sourceCode.getScope(identifier);

    while (scope !== null) {
        for (const reference of scope.references) {
            if (reference.identifier === identifier) {
                return (
                    reference.resolved === null ||
                    reference.resolved.defs.length === 0
                );
            }
        }

        for (const reference of scope.through) {
            if (reference.identifier === identifier) {
                return (
                    reference.resolved === null ||
                    reference.resolved.defs.length === 0
                );
            }
        }

        scope = scope.upper;
    }

    return false;
};

const isTypeOnlyPosition = (
    sourceCode: Readonly<SourceCode>,
    node: Readonly<es.Node>
): boolean =>
    sourceCode.getAncestors(node).some(
        (ancestor) =>
            ancestor.type.startsWith("TS") &&
            // eslint-disable-next-line typefest/prefer-ts-extras-set-has -- The generic helper rejects the heterogeneous TSESTree node-type union.
            !transparentTypeScriptNodeTypes.has(ancestor.type)
    );

const isDirectTypeofOperand = (node: Readonly<es.Node>): boolean =>
    node.parent?.type === AST_NODE_TYPES.UnaryExpression &&
    node.parent.operator === "typeof" &&
    node.parent.argument === node;

type GuardAvailability =
    | "false"
    | "true"
    | undefined;

const invertAvailability = (
    availability: GuardAvailability
): GuardAvailability => {
    if (availability === "true") {
        return "false";
    }

    if (availability === "false") {
        return "true";
    }

    return undefined;
};

const getTypeofIdentifierName = (
    node: Readonly<es.Expression | es.PrivateIdentifier>
): string | undefined => {
    if (
        node.type === AST_NODE_TYPES.UnaryExpression &&
        node.operator === "typeof" &&
        node.argument.type === AST_NODE_TYPES.Identifier
    ) {
        return node.argument.name;
    }

    return undefined;
};

const getStringLiteralValue = (
    node: Readonly<es.Expression | es.PrivateIdentifier>
): string | undefined =>
    node.type === AST_NODE_TYPES.Literal && typeof node.value === "string"
        ? node.value
        : undefined;

const getAvailabilityGuard = (
    expression: Readonly<es.Expression>,
    globalName: string
): GuardAvailability => {
    if (expression.type === AST_NODE_TYPES.UnaryExpression) {
        return expression.operator === "!"
            ? invertAvailability(
                  getAvailabilityGuard(expression.argument, globalName)
              )
            : undefined;
    }

    if (expression.type !== AST_NODE_TYPES.BinaryExpression) {
        return undefined;
    }

    const leftTypeofName = getTypeofIdentifierName(expression.left);
    const rightTypeofName = getTypeofIdentifierName(expression.right);
    const leftLiteral = getStringLiteralValue(expression.left);
    const rightLiteral = getStringLiteralValue(expression.right);
    const typeofName = leftTypeofName ?? rightTypeofName;
    const comparedValue = isDefined(leftTypeofName)
        ? rightLiteral
        : leftLiteral;

    if (typeofName !== globalName || !isDefined(comparedValue)) {
        return undefined;
    }

    const isEquality =
        expression.operator === "==" || expression.operator === "===";
    const isInequality =
        expression.operator === "!=" || expression.operator === "!==";

    if (comparedValue === "undefined") {
        if (isEquality) {
            return "false";
        }

        if (isInequality) {
            return "true";
        }
    }

    if (
        (comparedValue === "object" || comparedValue === "function") &&
        isEquality
    ) {
        return "true";
    }

    return undefined;
};

const isGuardedAvailabilityUse = (
    sourceCode: Readonly<SourceCode>,
    node: Readonly<es.Node>,
    globalName: string
): boolean => {
    const ancestors = sourceCode.getAncestors(node);

    for (let index = 0; index < ancestors.length; index += 1) {
        const ancestor = ancestors[index];
        const childOnPath = ancestors[index + 1] ?? node;

        if (ancestor === undefined) {
            continue;
        }

        if (ancestor.type === AST_NODE_TYPES.IfStatement) {
            const availability = getAvailabilityGuard(
                ancestor.test,
                globalName
            );

            if (
                (ancestor.consequent === childOnPath &&
                    availability === "true") ||
                (ancestor.alternate === childOnPath && availability === "false")
            ) {
                return true;
            }
        }

        if (ancestor.type === AST_NODE_TYPES.ConditionalExpression) {
            const availability = getAvailabilityGuard(
                ancestor.test,
                globalName
            );

            if (
                (ancestor.consequent === childOnPath &&
                    availability === "true") ||
                (ancestor.alternate === childOnPath && availability === "false")
            ) {
                return true;
            }
        }

        if (
            ancestor.type === AST_NODE_TYPES.LogicalExpression &&
            ancestor.right === childOnPath
        ) {
            const availability = getAvailabilityGuard(
                ancestor.left,
                globalName
            );

            if (
                (ancestor.operator === "&&" && availability === "true") ||
                (ancestor.operator === "||" && availability === "false")
            ) {
                return true;
            }
        }
    }

    return false;
};

const getEnclosingFunction = (
    sourceCode: Readonly<SourceCode>,
    node: Readonly<es.Node>
): Readonly<FunctionNode> | undefined => {
    const ancestors = sourceCode.getAncestors(node);

    for (let index = ancestors.length - 1; index >= 0; index -= 1) {
        const ancestor = ancestors[index];

        if (ancestor !== undefined && isFunctionNode(ancestor)) {
            return ancestor;
        }
    }

    return undefined;
};

const unwrapCallee = (
    expression: Readonly<es.Expression>
): Readonly<es.Expression> => {
    if (
        expression.type === AST_NODE_TYPES.ChainExpression ||
        expression.type === AST_NODE_TYPES.TSAsExpression ||
        expression.type === AST_NODE_TYPES.TSNonNullExpression ||
        expression.type === AST_NODE_TYPES.TSSatisfiesExpression ||
        expression.type === AST_NODE_TYPES.TSTypeAssertion
    ) {
        return unwrapCallee(expression.expression);
    }

    return expression;
};

const getCallName = (node: Readonly<es.CallExpression>): string | undefined => {
    const callee = unwrapCallee(node.callee);

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

const isImmediatelyInvoked = (node: Readonly<FunctionNode>): boolean =>
    node.parent.type === AST_NODE_TYPES.CallExpression &&
    unwrapCallee(node.parent.callee) === node;

const renderTimeHookNames: ReadonlySet<string> = new Set([
    "useMemo",
    "useReducer",
    "useState",
]);

const isRenderTimeHookCallback = (node: Readonly<FunctionNode>): boolean =>
    node.type !== AST_NODE_TYPES.FunctionDeclaration &&
    node.parent.type === AST_NODE_TYPES.CallExpression &&
    // eslint-disable-next-line unicorn/prefer-includes -- TSESTree's argument union rejects this narrower function-node type in includes().
    node.parent.arguments.some((argument) => argument === node) &&
    setHas(renderTimeHookNames, getCallName(node.parent) ?? "");

const getEffectiveExecutionFunction = (
    sourceCode: Readonly<SourceCode>,
    node: Readonly<es.Node>,
    includeRenderTimeHooks: boolean
): Readonly<FunctionNode> | undefined => {
    let enclosingFunction = getEnclosingFunction(sourceCode, node);

    while (isDefined(enclosingFunction)) {
        if (
            !isImmediatelyInvoked(enclosingFunction) &&
            (!includeRenderTimeHooks ||
                !isRenderTimeHookCallback(enclosingFunction))
        ) {
            break;
        }

        enclosingFunction = getEnclosingFunction(sourceCode, enclosingFunction);
    }

    return enclosingFunction;
};

const isWithinNode = (
    node: Readonly<es.Node>,
    container: Readonly<es.Node>
): boolean =>
    arrayFirst(node.range) >= arrayFirst(container.range) &&
    node.range[1] <= container.range[1];

const getInstancePropertyInitializer = (
    sourceCode: Readonly<SourceCode>,
    node: Readonly<es.Node>
): Readonly<es.PropertyDefinition> | undefined => {
    const ancestors = sourceCode.getAncestors(node);

    for (let index = ancestors.length - 1; index >= 0; index -= 1) {
        const ancestor = ancestors[index];

        if (
            ancestor?.type === AST_NODE_TYPES.PropertyDefinition &&
            !ancestor.static &&
            ancestor.value !== null &&
            isWithinNode(node, ancestor.value)
        ) {
            return ancestor;
        }
    }

    return undefined;
};

const getChildNodes = (
    sourceCode: Readonly<SourceCode>,
    node: Readonly<es.Node>
): readonly Readonly<es.Node>[] => {
    const visitorKeys = sourceCode.visitorKeys[node.type] ?? [];
    let childNodes: readonly Readonly<es.Node>[] = [];

    const addNode = (value: unknown): void => {
        if (isNode(value)) {
            childNodes = [...childNodes, value];
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

const functionContainsJsx = (
    sourceCode: Readonly<SourceCode>,
    node: Readonly<FunctionNode>
): boolean => {
    const stack: es.Node[] = [node.body];

    while (stack.length > 0) {
        const current = stack.pop();

        if (current === undefined) {
            continue;
        }

        if (
            current.type === AST_NODE_TYPES.JSXElement ||
            current.type === AST_NODE_TYPES.JSXFragment
        ) {
            return true;
        }

        if (current !== node.body && isFunctionNode(current)) {
            continue;
        }

        stack.push(...getChildNodes(sourceCode, current));
    }

    return false;
};

const getStaticMethodName = (
    node: Readonly<es.MethodDefinition>
): string | undefined => {
    if (!node.computed && node.key.type === AST_NODE_TYPES.Identifier) {
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

const isConstructorFunction = (node: Readonly<FunctionNode>): boolean =>
    node.type === AST_NODE_TYPES.FunctionExpression &&
    node.parent.type === AST_NODE_TYPES.MethodDefinition &&
    node.parent.kind === "constructor";

const isReactClassRenderFunction = (
    sourceCode: Readonly<SourceCode>,
    node: Readonly<FunctionNode>
): boolean =>
    node.type === AST_NODE_TYPES.FunctionExpression &&
    node.parent.type === AST_NODE_TYPES.MethodDefinition &&
    node.parent.kind === "method" &&
    !node.parent.static &&
    getStaticMethodName(node.parent) === "render" &&
    functionContainsJsx(sourceCode, node);

const isComponentName = (name: string): boolean => {
    const firstCharacter = name.at(0);

    return (
        isDefined(firstCharacter) &&
        firstCharacter === firstCharacter.toUpperCase() &&
        firstCharacter !== firstCharacter.toLowerCase()
    );
};

const isReactFunctionComponent = (
    sourceCode: Readonly<SourceCode>,
    node: Readonly<FunctionNode>
): boolean => {
    if (!functionContainsJsx(sourceCode, node)) {
        return false;
    }

    if (node.type === AST_NODE_TYPES.FunctionDeclaration && node.id !== null) {
        return isComponentName(node.id.name);
    }

    if (
        node.parent.type === AST_NODE_TYPES.VariableDeclarator &&
        node.parent.id.type === AST_NODE_TYPES.Identifier
    ) {
        return isComponentName(node.parent.id.name);
    }

    if (node.parent.type === AST_NODE_TYPES.CallExpression) {
        const callName = getCallName(node.parent);
        return callName === "forwardRef" || callName === "memo";
    }

    return false;
};

const isInExecutionContext = (
    sourceCode: Readonly<SourceCode>,
    node: Readonly<es.Node>,
    executionContext: ExecutionContext
): boolean => {
    const includeRenderTimeHooks =
        executionContext === "react-function-component";
    const executionFunction = getEffectiveExecutionFunction(
        sourceCode,
        node,
        includeRenderTimeHooks
    );
    const instanceInitializer = getInstancePropertyInitializer(
        sourceCode,
        node
    );

    switch (executionContext) {
        case "constructor": {
            return (
                (executionFunction === undefined &&
                    instanceInitializer !== undefined) ||
                (executionFunction !== undefined &&
                    isConstructorFunction(executionFunction))
            );
        }
        case "module": {
            return (
                executionFunction === undefined &&
                instanceInitializer === undefined
            );
        }
        case "react-class-render": {
            return (
                executionFunction !== undefined &&
                isReactClassRenderFunction(sourceCode, executionFunction)
            );
        }
        case "react-function-component": {
            return (
                executionFunction !== undefined &&
                isReactFunctionComponent(sourceCode, executionFunction)
            );
        }
        default: {
            return assertNever(executionContext);
        }
    }
};

const shouldReportGlobalUse = (
    sourceCode: Readonly<SourceCode>,
    node: Readonly<es.Node>,
    globalName: string,
    executionContext: ExecutionContext
): boolean =>
    isBrowserOnlyGlobalName(globalName) &&
    !isTypeOnlyPosition(sourceCode, node) &&
    !isDirectTypeofOperand(node) &&
    !isGuardedAvailabilityUse(sourceCode, node, globalName) &&
    isInExecutionContext(sourceCode, node, executionContext);

/** Create one SSR DOM-global rule with shared lexical and execution analysis. */
export const createSsrDomGlobalsRule = ({
    description,
    executionContext,
    message,
    name,
}: Readonly<{
    readonly description: string;
    readonly executionContext: ExecutionContext;
    readonly message: string;
    readonly name: string;
}>): ReturnType<typeof ruleCreator<Options, MessageIds>> =>
    ruleCreator<Options, MessageIds>({
        create: (context) => ({
            Identifier: (node: Readonly<es.Identifier>): void => {
                if (
                    !isReferenceIdentifier(context.sourceCode, node) ||
                    !shouldReportGlobalUse(
                        context.sourceCode,
                        node,
                        node.name,
                        executionContext
                    )
                ) {
                    return;
                }

                context.report({
                    data: {
                        name: node.name,
                    },
                    messageId: "forbidden",
                    node,
                });
            },
            MemberExpression: (node: Readonly<es.MemberExpression>): void => {
                if (
                    node.object.type !== AST_NODE_TYPES.Identifier ||
                    node.object.name !== "globalThis" ||
                    !isReferenceIdentifier(context.sourceCode, node.object)
                ) {
                    return;
                }

                const globalName = getStaticMemberName(node);

                if (
                    !isDefined(globalName) ||
                    !shouldReportGlobalUse(
                        context.sourceCode,
                        node,
                        globalName,
                        executionContext
                    )
                ) {
                    return;
                }

                context.report({
                    data: {
                        name: `globalThis.${globalName}`,
                    },
                    messageId: "forbidden",
                    node,
                });
            },
        }),
        defaultOptions: [],
        meta: {
            deprecated: false,
            docs: {
                deprecated: false,
                description,
                frozen: false,
                recommended: false,
                url: `https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/${name}`,
            },
            hasSuggestions: false,
            messages: {
                forbidden: message,
            },
            schema: [],
            type: "problem",
        },
        name,
    });

export type { ExecutionContext };
