import type { TSESTree as es } from "@typescript-eslint/utils";

import { AST_NODE_TYPES, TSESLint } from "@typescript-eslint/utils";
import globals from "globals";
import {
    arrayFirst,
    assertNever,
    isDefined,
    objectHasOwn,
    objectKeys,
    setHas,
} from "ts-extras";

import { isSameNode } from "./node-identity.js";
import { ruleCreator } from "./rule-creator.js";

type AnalysisCache = Readonly<{
    readonly effectiveExecutionFunctions: readonly [
        WeakMap<Readonly<es.Node>, null | Readonly<FunctionNode>>,
        WeakMap<Readonly<es.Node>, null | Readonly<FunctionNode>>,
    ];
    readonly functionContainsJsx: WeakMap<Readonly<FunctionNode>, boolean>;
    readonly guardAvailability: WeakMap<
        Readonly<es.Expression>,
        Map<string, GuardAvailability>
    >;
    readonly guardedUses: WeakMap<Readonly<es.Node>, Map<string, boolean>>;
    readonly references: WeakMap<
        Readonly<es.Identifier>,
        null | TSESLint.Scope.Reference
    >;
}>;

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

const containsExpression = (
    expressions: ReadonlySet<Readonly<es.Expression>>,
    expression: Readonly<es.Expression>
): boolean => setHas(expressions, expression);

const unwrapCallee = (
    expression: Readonly<es.Expression>
): Readonly<es.Expression> => {
    if (
        expression.type === AST_NODE_TYPES.ChainExpression ||
        expression.type === AST_NODE_TYPES.TSAsExpression ||
        expression.type === AST_NODE_TYPES.TSInstantiationExpression ||
        expression.type === AST_NODE_TYPES.TSNonNullExpression ||
        expression.type === AST_NODE_TYPES.TSSatisfiesExpression ||
        expression.type === AST_NODE_TYPES.TSTypeAssertion
    ) {
        return unwrapCallee(expression.expression);
    }

    return expression;
};

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

const getReference = (
    sourceCode: Readonly<SourceCode>,
    identifier: Readonly<es.Identifier>,
    cache: Readonly<AnalysisCache>
): null | Readonly<TSESLint.Scope.Reference> => {
    const cachedReference = cache.references.get(identifier);

    if (isDefined(cachedReference) || cache.references.has(identifier)) {
        return cachedReference ?? null;
    }

    let scope: null | TSESLint.Scope.Scope = sourceCode.getScope(identifier);

    while (scope !== null) {
        for (const reference of scope.references) {
            if (reference.identifier === identifier) {
                cache.references.set(identifier, reference);
                return reference;
            }
        }

        for (const reference of scope.through) {
            if (reference.identifier === identifier) {
                cache.references.set(identifier, reference);
                return reference;
            }
        }

        scope = scope.upper;
    }

    cache.references.set(identifier, null);
    return null;
};

const isReferenceIdentifier = (
    sourceCode: Readonly<SourceCode>,
    identifier: Readonly<es.Identifier>,
    cache: Readonly<AnalysisCache>
): boolean => {
    const reference = getReference(sourceCode, identifier, cache);

    return (
        reference !== null &&
        (reference.resolved === null || reference.resolved.defs.length === 0)
    );
};

const isImportedIdentifier = (
    sourceCode: Readonly<SourceCode>,
    identifier: Readonly<es.Identifier>,
    cache: Readonly<AnalysisCache>
): boolean =>
    getReference(sourceCode, identifier, cache)?.resolved?.defs.some(
        (definition) =>
            definition.type === TSESLint.Scope.DefinitionType.ImportBinding
    ) === true;

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

const isDirectTypeofOperand = (node: Readonly<es.Node>): boolean => {
    let operand: Readonly<es.Node> = node;
    let parent: Readonly<es.Node> | undefined = operand.parent;

    while (
        isDefined(parent) &&
        (parent.type === AST_NODE_TYPES.ChainExpression ||
            // eslint-disable-next-line typefest/prefer-ts-extras-set-has -- The generic helper rejects the heterogeneous TSESTree node-type union.
            transparentTypeScriptNodeTypes.has(parent.type)) &&
        Reflect.get(parent, "expression") === operand
    ) {
        operand = parent;
        parent = operand.parent;
    }

    return (
        parent?.type === AST_NODE_TYPES.UnaryExpression &&
        parent.operator === "typeof" &&
        parent.argument === operand
    );
};

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

const getStringLiteralValue = (
    node: Readonly<es.Expression | es.PrivateIdentifier>
): string | undefined =>
    node.type === AST_NODE_TYPES.Literal && typeof node.value === "string"
        ? node.value
        : undefined;

const getGlobalThisMemberName = (
    sourceCode: Readonly<SourceCode>,
    expression: Readonly<es.Expression>,
    cache: Readonly<AnalysisCache>
): string | undefined => {
    const unwrappedExpression = unwrapCallee(expression);

    if (unwrappedExpression.type !== AST_NODE_TYPES.MemberExpression) {
        return undefined;
    }

    const object = unwrappedExpression.object;

    return object.type === AST_NODE_TYPES.Identifier &&
        object.name === "globalThis" &&
        isReferenceIdentifier(sourceCode, object, cache)
        ? getStaticMemberName(unwrappedExpression)
        : undefined;
};

const getTypeofGlobalName = (
    sourceCode: Readonly<SourceCode>,
    node: Readonly<es.Expression | es.PrivateIdentifier>,
    cache: Readonly<AnalysisCache>
): string | undefined => {
    if (
        node.type !== AST_NODE_TYPES.UnaryExpression ||
        node.operator !== "typeof"
    ) {
        return undefined;
    }

    if (node.argument.type === AST_NODE_TYPES.Identifier) {
        return isReferenceIdentifier(sourceCode, node.argument, cache)
            ? node.argument.name
            : undefined;
    }

    return getGlobalThisMemberName(sourceCode, node.argument, cache);
};

const getInGlobalName = (
    sourceCode: Readonly<SourceCode>,
    expression: Readonly<es.BinaryExpression>,
    cache: Readonly<AnalysisCache>
): string | undefined => {
    if (
        expression.operator !== "in" ||
        expression.left.type !== AST_NODE_TYPES.Literal ||
        typeof expression.left.value !== "string"
    ) {
        return undefined;
    }

    const right = unwrapCallee(expression.right);

    return right.type === AST_NODE_TYPES.Identifier &&
        right.name === "globalThis" &&
        isReferenceIdentifier(sourceCode, right, cache)
        ? expression.left.value
        : undefined;
};

const getImmutablePredicateInitializer = (
    sourceCode: Readonly<SourceCode>,
    identifier: Readonly<es.Identifier>,
    cache: Readonly<AnalysisCache>
): Readonly<es.Expression> | undefined => {
    const reference = getReference(sourceCode, identifier, cache);
    const variable = reference?.resolved;

    if (variable === null || variable?.defs.length !== 1) {
        return undefined;
    }

    const [definition] = variable.defs;

    return definition?.type === TSESLint.Scope.DefinitionType.Variable &&
        definition.node.id.type === AST_NODE_TYPES.Identifier &&
        definition.node.id.name === identifier.name &&
        definition.node.init !== null &&
        definition.node.parent.kind === "const"
        ? definition.node.init
        : undefined;
};

type GuardResolver = (expression: Readonly<es.Expression>) => GuardAvailability;

const getIdentifierGuardAvailability = (
    sourceCode: Readonly<SourceCode>,
    identifier: Readonly<es.Identifier>,
    cache: Readonly<AnalysisCache>,
    resolveGuard: GuardResolver
): GuardAvailability => {
    const initializer = getImmutablePredicateInitializer(
        sourceCode,
        identifier,
        cache
    );

    return isDefined(initializer) ? resolveGuard(initializer) : undefined;
};

const isEqualityOperator = (
    operator: es.BinaryExpression["operator"]
): boolean => operator === "==" || operator === "===";

const isInequalityOperator = (
    operator: es.BinaryExpression["operator"]
): boolean => operator === "!=" || operator === "!==";

const getTypeofComparisonAvailability = (
    sourceCode: Readonly<SourceCode>,
    expression: Readonly<es.BinaryExpression>,
    globalName: string,
    cache: Readonly<AnalysisCache>
): GuardAvailability => {
    const leftTypeofName = getTypeofGlobalName(
        sourceCode,
        expression.left,
        cache
    );
    const rightTypeofName = getTypeofGlobalName(
        sourceCode,
        expression.right,
        cache
    );
    const comparedValue = isDefined(leftTypeofName)
        ? getStringLiteralValue(expression.right)
        : getStringLiteralValue(expression.left);

    if (
        (leftTypeofName ?? rightTypeofName) !== globalName ||
        !isDefined(comparedValue)
    ) {
        return undefined;
    }

    if (comparedValue === "undefined") {
        if (isEqualityOperator(expression.operator)) {
            return "false";
        }

        return isInequalityOperator(expression.operator) ? "true" : undefined;
    }

    return isEqualityOperator(expression.operator) &&
        (comparedValue === "object" || comparedValue === "function")
        ? "true"
        : undefined;
};

const getBinaryGuardAvailability = (
    sourceCode: Readonly<SourceCode>,
    expression: Readonly<es.BinaryExpression>,
    globalName: string,
    cache: Readonly<AnalysisCache>
): GuardAvailability => {
    const inGlobalName = getInGlobalName(sourceCode, expression, cache);

    return isDefined(inGlobalName)
        ? inGlobalName === globalName
            ? "true"
            : undefined
        : getTypeofComparisonAvailability(
              sourceCode,
              expression,
              globalName,
              cache
          );
};

const getUncachedGuardAvailability = (
    sourceCode: Readonly<SourceCode>,
    expression: Readonly<es.Expression>,
    globalName: string,
    cache: Readonly<AnalysisCache>,
    resolveGuard: GuardResolver
): GuardAvailability => {
    if (expression.type === AST_NODE_TYPES.Identifier) {
        return getIdentifierGuardAvailability(
            sourceCode,
            expression,
            cache,
            resolveGuard
        );
    }

    if (expression.type === AST_NODE_TYPES.UnaryExpression) {
        return expression.operator === "!"
            ? invertAvailability(resolveGuard(expression.argument))
            : undefined;
    }

    return expression.type === AST_NODE_TYPES.BinaryExpression
        ? getBinaryGuardAvailability(sourceCode, expression, globalName, cache)
        : undefined;
};

const getAvailabilityGuard = (
    sourceCode: Readonly<SourceCode>,
    expression: Readonly<es.Expression>,
    globalName: string,
    cache: Readonly<AnalysisCache>,
    visitedExpressions: Set<Readonly<es.Expression>> = new Set()
): GuardAvailability => {
    const unwrappedExpression = unwrapCallee(expression);
    const cachedByName = cache.guardAvailability.get(unwrappedExpression);

    if (cachedByName?.has(globalName) === true) {
        return cachedByName.get(globalName);
    }

    if (containsExpression(visitedExpressions, unwrappedExpression)) {
        return undefined;
    }

    visitedExpressions.add(unwrappedExpression);

    const resolveGuard: GuardResolver = (candidate) =>
        getAvailabilityGuard(
            sourceCode,
            candidate,
            globalName,
            cache,
            visitedExpressions
        );
    const availability = getUncachedGuardAvailability(
        sourceCode,
        unwrappedExpression,
        globalName,
        cache,
        resolveGuard
    );

    const availabilityByName =
        cachedByName ?? new Map<string, GuardAvailability>();
    availabilityByName.set(globalName, availability);
    cache.guardAvailability.set(unwrappedExpression, availabilityByName);

    return availability;
};

const isGuardedByAncestor = (
    sourceCode: Readonly<SourceCode>,
    ancestor: Readonly<es.Node>,
    childOnPath: Readonly<es.Node>,
    globalName: string,
    cache: Readonly<AnalysisCache>
): boolean => {
    if (
        ancestor.type === AST_NODE_TYPES.IfStatement ||
        ancestor.type === AST_NODE_TYPES.ConditionalExpression
    ) {
        const availability = getAvailabilityGuard(
            sourceCode,
            ancestor.test,
            globalName,
            cache
        );

        return (
            (availability === "true" &&
                isSameNode(ancestor.consequent, childOnPath)) ||
            (availability === "false" &&
                isSameNode(ancestor.alternate, childOnPath))
        );
    }

    if (
        ancestor.type !== AST_NODE_TYPES.LogicalExpression ||
        ancestor.right !== childOnPath
    ) {
        return false;
    }

    const availability = getAvailabilityGuard(
        sourceCode,
        ancestor.left,
        globalName,
        cache
    );

    return (
        (availability === "true" && ancestor.operator === "&&") ||
        (availability === "false" && ancestor.operator === "||")
    );
};

const isGuardedAvailabilityUse = (
    sourceCode: Readonly<SourceCode>,
    node: Readonly<es.Node>,
    globalName: string,
    cache: Readonly<AnalysisCache>
): boolean => {
    const cachedByName = cache.guardedUses.get(node);

    if (cachedByName?.has(globalName) === true) {
        return cachedByName.get(globalName) ?? false;
    }

    const ancestors = sourceCode.getAncestors(node);
    let guarded = false;

    for (let index = 0; index < ancestors.length; index += 1) {
        const ancestor = ancestors[index];
        const childOnPath = ancestors[index + 1] ?? node;

        if (
            ancestor !== undefined &&
            isGuardedByAncestor(
                sourceCode,
                ancestor,
                childOnPath,
                globalName,
                cache
            )
        ) {
            guarded = true;
            break;
        }
    }

    const guardedByName = cachedByName ?? new Map<string, boolean>();
    guardedByName.set(globalName, guarded);
    cache.guardedUses.set(node, guardedByName);

    return guarded;
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

const getCalleeRootIdentifier = (
    expression: Readonly<es.Expression>
): Readonly<es.Identifier> | undefined => {
    const callee = unwrapCallee(expression);

    if (callee.type === AST_NODE_TYPES.Identifier) {
        return callee;
    }

    if (callee.type === AST_NODE_TYPES.CallExpression) {
        return getCalleeRootIdentifier(callee.callee);
    }

    if (callee.type !== AST_NODE_TYPES.MemberExpression) {
        return undefined;
    }

    return callee.object.type === AST_NODE_TYPES.Super
        ? undefined
        : getCalleeRootIdentifier(callee.object);
};

const recognizedComponentWrapperNames: ReadonlySet<string> = new Set([
    "forwardRef",
    "memo",
    "observer",
]);

/**
 * Recognize established wrappers by name and arbitrary third-party wrappers by
 * import provenance. Requiring either signal prevents ordinary calls such as
 * `items.map(Component)` from acquiring component ownership merely because the
 * result is assigned to an uppercase binding or default-exported.
 */
const isComponentWrapperCall = (
    sourceCode: Readonly<SourceCode>,
    node: Readonly<es.CallExpression>,
    cache: Readonly<AnalysisCache>
): boolean => {
    const callName = getCallName(node);

    if (
        isDefined(callName) &&
        setHas(recognizedComponentWrapperNames, callName)
    ) {
        return true;
    }

    const rootIdentifier = getCalleeRootIdentifier(node.callee);

    return (
        isDefined(rootIdentifier) &&
        isImportedIdentifier(sourceCode, rootIdentifier, cache)
    );
};

const isTransparentCalleeWrapper = (
    parent: Readonly<es.Node> | undefined,
    child: Readonly<es.Node>
): boolean =>
    parent !== undefined &&
    (parent.type === AST_NODE_TYPES.ChainExpression ||
        // eslint-disable-next-line typefest/prefer-ts-extras-set-has -- The generic helper rejects the heterogeneous TSESTree node-type union.
        transparentTypeScriptNodeTypes.has(parent.type)) &&
    Reflect.get(parent, "expression") === child;

const isImmediatelyInvoked = (node: Readonly<FunctionNode>): boolean => {
    let calleeNode: Readonly<es.Node> = node;
    let parent: es.Node | undefined = calleeNode.parent;

    while (
        parent !== undefined &&
        isTransparentCalleeWrapper(parent, calleeNode)
    ) {
        calleeNode = parent;
        parent = calleeNode.parent;
    }

    if (parent?.type !== AST_NODE_TYPES.CallExpression) {
        return false;
    }

    return isSameNode(unwrapCallee(parent.callee), node);
};

const renderTimeHookNames: ReadonlySet<string> = new Set([
    "useMemo",
    "useReducer",
    "useState",
]);

const isCallArgumentAtIndex = (
    node: Readonly<FunctionNode>,
    index: number
): boolean =>
    node.type !== AST_NODE_TYPES.FunctionDeclaration &&
    node.parent.type === AST_NODE_TYPES.CallExpression &&
    node.parent.arguments[index] === node;

const isRenderTimeHookCallback = (node: Readonly<FunctionNode>): boolean => {
    if (
        node.type === AST_NODE_TYPES.FunctionDeclaration ||
        node.parent.type !== AST_NODE_TYPES.CallExpression
    ) {
        return false;
    }

    const callName = getCallName(node.parent);

    if (!setHas(renderTimeHookNames, callName ?? "")) {
        return false;
    }

    // UseMemo factories and useState lazy initializers execute while rendering.
    // A useReducer reducer is deferred until dispatch; only its third-argument
    // initializer executes during initialization.
    return callName === "useReducer"
        ? isCallArgumentAtIndex(node, 2)
        : isCallArgumentAtIndex(node, 0);
};

const synchronousIterationCallbackNames: ReadonlySet<string> = new Set([
    "every",
    "filter",
    "find",
    "findIndex",
    "findLast",
    "findLastIndex",
    "flatMap",
    "forEach",
    "map",
    "reduce",
    "reduceRight",
    "some",
]);

const isSynchronousIterationCallback = (
    node: Readonly<FunctionNode>
): boolean =>
    node.type !== AST_NODE_TYPES.FunctionDeclaration &&
    node.parent.type === AST_NODE_TYPES.CallExpression &&
    isCallArgumentAtIndex(node, 0) &&
    setHas(synchronousIterationCallbackNames, getCallName(node.parent) ?? "");

const isRenderTimeNestedFunction = (node: Readonly<FunctionNode>): boolean =>
    isImmediatelyInvoked(node) ||
    isRenderTimeHookCallback(node) ||
    isSynchronousIterationCallback(node);

const getEffectiveExecutionFunction = (
    sourceCode: Readonly<SourceCode>,
    node: Readonly<es.Node>,
    includeRenderTimeHooks: boolean,
    cache: Readonly<AnalysisCache>
): Readonly<FunctionNode> | undefined => {
    const executionFunctionCache =
        cache.effectiveExecutionFunctions[includeRenderTimeHooks ? 1 : 0];
    const cachedExecutionFunction = executionFunctionCache.get(node);

    if (
        cachedExecutionFunction !== undefined ||
        executionFunctionCache.has(node)
    ) {
        return cachedExecutionFunction ?? undefined;
    }

    let enclosingFunction = getEnclosingFunction(sourceCode, node);

    while (isDefined(enclosingFunction)) {
        if (
            !isImmediatelyInvoked(enclosingFunction) &&
            !isSynchronousIterationCallback(enclosingFunction) &&
            (!includeRenderTimeHooks ||
                !isRenderTimeHookCallback(enclosingFunction))
        ) {
            break;
        }

        enclosingFunction = getEnclosingFunction(sourceCode, enclosingFunction);
    }

    executionFunctionCache.set(node, enclosingFunction ?? null);
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

const getFunctionJsxSearchChildren = (
    sourceCode: Readonly<SourceCode>,
    current: Readonly<es.Node>
): readonly Readonly<es.Node>[] => {
    if (!isFunctionNode(current)) {
        return getChildNodes(sourceCode, current);
    }

    return isRenderTimeNestedFunction(current) ? [current.body] : [];
};

const functionContainsJsx = (
    sourceCode: Readonly<SourceCode>,
    node: Readonly<FunctionNode>,
    cache: Readonly<AnalysisCache>
): boolean => {
    const cachedResult = cache.functionContainsJsx.get(node);

    if (isDefined(cachedResult)) {
        return cachedResult;
    }

    if (
        node.body.type === AST_NODE_TYPES.JSXElement ||
        node.body.type === AST_NODE_TYPES.JSXFragment
    ) {
        cache.functionContainsJsx.set(node, true);
        return true;
    }

    const stack: es.Node[] = [...getChildNodes(sourceCode, node.body)];

    while (stack.length > 0) {
        const current = stack.pop();

        if (current !== undefined) {
            if (
                current.type === AST_NODE_TYPES.JSXElement ||
                current.type === AST_NODE_TYPES.JSXFragment
            ) {
                cache.functionContainsJsx.set(node, true);
                return true;
            }

            stack.push(...getFunctionJsxSearchChildren(sourceCode, current));
        }
    }

    cache.functionContainsJsx.set(node, false);
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
    node: Readonly<FunctionNode>,
    cache: Readonly<AnalysisCache>
): boolean =>
    node.type === AST_NODE_TYPES.FunctionExpression &&
    node.parent.type === AST_NODE_TYPES.MethodDefinition &&
    node.parent.kind === "method" &&
    !node.parent.static &&
    getStaticMethodName(node.parent) === "render" &&
    functionContainsJsx(sourceCode, node, cache);

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
    node: Readonly<FunctionNode>,
    cache: Readonly<AnalysisCache>
): boolean => {
    if (!functionContainsJsx(sourceCode, node, cache)) {
        return false;
    }

    if (node.type === AST_NODE_TYPES.FunctionDeclaration) {
        return node.id === null || isComponentName(node.id.name);
    }

    let valueNode: Readonly<es.Node> = node;
    let parent: Readonly<es.Node> | undefined = valueNode.parent;

    while (isDefined(parent) && isTransparentCalleeWrapper(parent, valueNode)) {
        valueNode = parent;
        parent = valueNode.parent;
    }

    while (
        parent?.type === AST_NODE_TYPES.CallExpression &&
        isSameNode(arrayFirst(parent.arguments), valueNode) &&
        isComponentWrapperCall(sourceCode, parent, cache)
    ) {
        valueNode = parent;
        parent = valueNode.parent;

        while (
            isDefined(parent) &&
            isTransparentCalleeWrapper(parent, valueNode)
        ) {
            valueNode = parent;
            parent = valueNode.parent;
        }
    }

    if (
        parent?.type === AST_NODE_TYPES.VariableDeclarator &&
        parent.id.type === AST_NODE_TYPES.Identifier
    ) {
        return isComponentName(parent.id.name);
    }

    return parent?.type === AST_NODE_TYPES.ExportDefaultDeclaration;
};

const isInExecutionContext = (
    sourceCode: Readonly<SourceCode>,
    node: Readonly<es.Node>,
    executionContext: ExecutionContext,
    cache: Readonly<AnalysisCache>
): boolean => {
    const includeRenderTimeHooks =
        executionContext === "react-function-component";
    const executionFunction = getEffectiveExecutionFunction(
        sourceCode,
        node,
        includeRenderTimeHooks,
        cache
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
                isReactClassRenderFunction(sourceCode, executionFunction, cache)
            );
        }
        case "react-function-component": {
            return (
                executionFunction !== undefined &&
                isReactFunctionComponent(sourceCode, executionFunction, cache)
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
    executionContext: ExecutionContext,
    cache: Readonly<AnalysisCache>
): boolean =>
    isBrowserOnlyGlobalName(globalName) &&
    !isTypeOnlyPosition(sourceCode, node) &&
    !isDirectTypeofOperand(node) &&
    !isGuardedAvailabilityUse(sourceCode, node, globalName, cache) &&
    isInExecutionContext(sourceCode, node, executionContext, cache);

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
        create: (context) => {
            const cache: AnalysisCache = {
                effectiveExecutionFunctions: [new WeakMap(), new WeakMap()],
                functionContainsJsx: new WeakMap(),
                guardAvailability: new WeakMap(),
                guardedUses: new WeakMap(),
                references: new WeakMap(),
            };

            return {
                Identifier: (node: Readonly<es.Identifier>): void => {
                    if (
                        !isReferenceIdentifier(
                            context.sourceCode,
                            node,
                            cache
                        ) ||
                        !shouldReportGlobalUse(
                            context.sourceCode,
                            node,
                            node.name,
                            executionContext,
                            cache
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
                MemberExpression: (
                    node: Readonly<es.MemberExpression>
                ): void => {
                    if (
                        node.object.type !== AST_NODE_TYPES.Identifier ||
                        node.object.name !== "globalThis" ||
                        !isReferenceIdentifier(
                            context.sourceCode,
                            node.object,
                            cache
                        )
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
                            executionContext,
                            cache
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
            };
        },
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
            languages: ["js/js"],
            messages: {
                forbidden: message,
            },
            schema: [],
            type: "problem",
        },
        name,
    });

export type { ExecutionContext };
