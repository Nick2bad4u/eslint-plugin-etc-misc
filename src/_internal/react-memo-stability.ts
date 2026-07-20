import {
    AST_NODE_TYPES,
    type TSESTree as es,
    TSESLint,
} from "@typescript-eslint/utils";
import { arrayAt, arrayFirst, isDefined, setHas } from "ts-extras";

import {
    findVariable,
    getSameFunctionConstInitializer,
    unwrapExpression,
} from "./jsx-react-analysis.js";

type MemoHookName = "useCallback" | "useMemo";

/** A render-local expression and the identity category it allocates. */
type UnstableValue = Readonly<{
    readonly kind: UnstableValueKind;
    readonly node: Readonly<es.Expression>;
}>;

/** Identity categories conservatively recognized by memoization rules. */
type UnstableValueKind =
    | "array"
    | "function"
    | "instance"
    | "jsx"
    | "object"
    | "unknown";

const memoHookNames: ReadonlySet<string> = new Set(["useCallback", "useMemo"]);

const memoHookSources: ReadonlySet<string> = new Set([
    "preact/compat",
    "preact/hooks",
    "react",
]);

const isMemoHookName = (name: string): name is MemoHookName =>
    setHas(memoHookNames, name);

const getImportedName = (
    specifier: Readonly<es.ImportSpecifier>
): string | undefined =>
    specifier.imported.type === AST_NODE_TYPES.Identifier
        ? specifier.imported.name
        : typeof specifier.imported.value === "string"
          ? specifier.imported.value
          : undefined;

const getImportBinding = (
    sourceCode: Readonly<TSESLint.SourceCode>,
    identifier: Readonly<es.Identifier>
):
    | Readonly<
          | es.ImportDefaultSpecifier
          | es.ImportNamespaceSpecifier
          | es.ImportSpecifier
      >
    | undefined => {
    const variable = findVariable(sourceCode, identifier);
    const definition = arrayFirst(variable?.defs ?? []);

    if (
        variable?.defs.length !== 1 ||
        definition?.type !== TSESLint.Scope.DefinitionType.ImportBinding ||
        definition.parent.type !== AST_NODE_TYPES.ImportDeclaration ||
        definition.parent.importKind === "type" ||
        typeof definition.parent.source.value !== "string" ||
        !setHas(memoHookSources, definition.parent.source.value) ||
        definition.node.type === AST_NODE_TYPES.TSImportEqualsDeclaration
    ) {
        return undefined;
    }

    return definition.node;
};

const isImportedDirectMemoHook = (
    sourceCode: Readonly<TSESLint.SourceCode>,
    identifier: Readonly<es.Identifier>
): boolean => {
    const binding = getImportBinding(sourceCode, identifier);

    return (
        binding?.type === AST_NODE_TYPES.ImportSpecifier &&
        binding.importKind !== "type" &&
        isMemoHookName(getImportedName(binding) ?? "")
    );
};

const isImportedMemoHookNamespace = (
    sourceCode: Readonly<TSESLint.SourceCode>,
    identifier: Readonly<es.Identifier>
): boolean => {
    const binding = getImportBinding(sourceCode, identifier);

    return (
        binding?.type === AST_NODE_TYPES.ImportDefaultSpecifier ||
        binding?.type === AST_NODE_TYPES.ImportNamespaceSpecifier
    );
};

const getStaticMemberName = (
    expression: Readonly<es.MemberExpression>
): string | undefined => {
    if (
        !expression.computed &&
        expression.property.type === AST_NODE_TYPES.Identifier
    ) {
        return expression.property.name;
    }

    return expression.computed &&
        expression.property.type === AST_NODE_TYPES.Literal &&
        typeof expression.property.value === "string"
        ? expression.property.value
        : undefined;
};

/** Return whether a call resolves to an imported React or Preact memo hook. */
export const isMemoHookCall = (
    sourceCode: Readonly<TSESLint.SourceCode>,
    expression: Readonly<es.Expression>
): boolean => {
    if (expression.type !== AST_NODE_TYPES.CallExpression) {
        return false;
    }

    const callee = unwrapExpression(expression.callee);

    if (callee.type === AST_NODE_TYPES.Identifier) {
        return isImportedDirectMemoHook(sourceCode, callee);
    }

    if (callee.type !== AST_NODE_TYPES.MemberExpression) {
        return false;
    }

    const object = unwrapExpression(callee.object);
    const memberName = getStaticMemberName(callee);

    return (
        object.type === AST_NODE_TYPES.Identifier &&
        isMemoHookName(memberName ?? "") &&
        isImportedMemoHookNamespace(sourceCode, object)
    );
};

const containsExpression = (
    expressions: ReadonlySet<Readonly<es.Expression>>,
    expression: Readonly<es.Expression>
): boolean => setHas(expressions, expression);

const getDirectUnstableValueKind = (
    expression: Readonly<es.Expression>,
    includeUnknown: boolean
): undefined | UnstableValueKind => {
    if (expression.type === AST_NODE_TYPES.ObjectExpression) {
        return "object";
    }

    if (expression.type === AST_NODE_TYPES.ArrayExpression) {
        return "array";
    }

    if (expression.type === AST_NODE_TYPES.NewExpression) {
        return "instance";
    }

    if (
        expression.type === AST_NODE_TYPES.ArrowFunctionExpression ||
        expression.type === AST_NODE_TYPES.FunctionExpression
    ) {
        return "function";
    }

    if (
        expression.type === AST_NODE_TYPES.JSXElement ||
        expression.type === AST_NODE_TYPES.JSXFragment
    ) {
        return "jsx";
    }

    return includeUnknown &&
        (expression.type === AST_NODE_TYPES.CallExpression ||
            expression.type === AST_NODE_TYPES.MemberExpression ||
            expression.type === AST_NODE_TYPES.TaggedTemplateExpression)
        ? "unknown"
        : undefined;
};

/** Collect conservative render-local values whose identities are unstable. */
export const collectUnstableValues = (
    sourceCode: Readonly<TSESLint.SourceCode>,
    expression: Readonly<es.Expression>,
    includeUnknown: boolean,
    visitedExpressions: Set<Readonly<es.Expression>> = new Set()
): readonly UnstableValue[] => {
    const unwrappedExpression = unwrapExpression(expression);

    if (containsExpression(visitedExpressions, unwrappedExpression)) {
        return [];
    }

    visitedExpressions.add(unwrappedExpression);

    if (isMemoHookCall(sourceCode, unwrappedExpression)) {
        return [];
    }

    const directKind = getDirectUnstableValueKind(
        unwrappedExpression,
        includeUnknown
    );

    if (isDefined(directKind)) {
        return [{ kind: directKind, node: unwrappedExpression }];
    }

    if (unwrappedExpression.type === AST_NODE_TYPES.Identifier) {
        const initializer = getSameFunctionConstInitializer(
            sourceCode,
            unwrappedExpression
        );

        return isDefined(initializer)
            ? collectUnstableValues(
                  sourceCode,
                  initializer,
                  includeUnknown,
                  visitedExpressions
              )
            : [];
    }

    if (unwrappedExpression.type === AST_NODE_TYPES.LogicalExpression) {
        return [
            ...collectUnstableValues(
                sourceCode,
                unwrappedExpression.left,
                includeUnknown,
                visitedExpressions
            ),
            ...collectUnstableValues(
                sourceCode,
                unwrappedExpression.right,
                includeUnknown,
                visitedExpressions
            ),
        ];
    }

    if (unwrappedExpression.type === AST_NODE_TYPES.ConditionalExpression) {
        return [
            ...collectUnstableValues(
                sourceCode,
                unwrappedExpression.consequent,
                includeUnknown,
                visitedExpressions
            ),
            ...collectUnstableValues(
                sourceCode,
                unwrappedExpression.alternate,
                includeUnknown,
                visitedExpressions
            ),
        ];
    }

    if (unwrappedExpression.type === AST_NODE_TYPES.SequenceExpression) {
        const finalExpression = arrayAt(unwrappedExpression.expressions, -1);

        return isDefined(finalExpression)
            ? collectUnstableValues(
                  sourceCode,
                  finalExpression,
                  includeUnknown,
                  visitedExpressions
              )
            : [];
    }

    return [];
};

export type { UnstableValue, UnstableValueKind };
