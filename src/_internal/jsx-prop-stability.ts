import {
    AST_NODE_TYPES,
    type TSESTree as es,
    type TSESLint,
} from "@typescript-eslint/utils";
import { arrayAt, isDefined, setHas } from "ts-extras";

import {
    getEnclosingFunction,
    getJsxAttributeName,
    getSameFunctionConstInitializer,
    getSimpleJsxElementName,
    isIntrinsicJsxName,
    isUnshadowedGlobalIdentifier,
    unwrapExpression,
} from "./jsx-react-analysis.js";

/** Shared option for allowing attributes on intrinsic JSX elements. */
type JsxPropRuleOption = Readonly<{
    readonly nativeAllowList?: "all" | readonly string[];
}>;

/** Rule options tuple used by all render-local JSX prop rules. */
type JsxPropRuleOptions = readonly [JsxPropRuleOption?];

/** Predicate for the render-local expression identity a rule reports. */
type StabilityMatcher = (
    expression: Readonly<es.Expression>,
    sourceCode: Readonly<TSESLint.SourceCode>
) => boolean;

type VisitorArguments = Readonly<{
    readonly context: Readonly<
        TSESLint.RuleContext<string, JsxPropRuleOptions>
    >;
    readonly matcher: StabilityMatcher;
    readonly options: JsxPropRuleOption;
    readonly report: (node: Readonly<es.Expression>) => void;
}>;

const containsExpression = (
    expressions: ReadonlySet<Readonly<es.Expression>>,
    expression: Readonly<es.Expression>
): boolean => setHas(expressions, expression);

const isPrimitiveLiteralValue = (value: unknown): boolean =>
    value === null ||
    typeof value === "bigint" ||
    typeof value === "boolean" ||
    typeof value === "number" ||
    typeof value === "string";

const isStaticallyPrimitiveExpression = (
    expression: Readonly<es.Expression>,
    sourceCode: Readonly<TSESLint.SourceCode>
): boolean => {
    const unwrappedExpression = unwrapExpression(expression);

    if (unwrappedExpression.type === AST_NODE_TYPES.Literal) {
        return isPrimitiveLiteralValue(unwrappedExpression.value);
    }

    if (
        unwrappedExpression.type === AST_NODE_TYPES.BinaryExpression ||
        unwrappedExpression.type === AST_NODE_TYPES.TemplateLiteral ||
        unwrappedExpression.type === AST_NODE_TYPES.UnaryExpression ||
        unwrappedExpression.type === AST_NODE_TYPES.UpdateExpression
    ) {
        return true;
    }

    if (unwrappedExpression.type === AST_NODE_TYPES.Identifier) {
        return (
            (unwrappedExpression.name === "Infinity" ||
                unwrappedExpression.name === "NaN" ||
                unwrappedExpression.name === "undefined") &&
            isUnshadowedGlobalIdentifier(sourceCode, unwrappedExpression)
        );
    }

    if (unwrappedExpression.type === AST_NODE_TYPES.ConditionalExpression) {
        return (
            isStaticallyPrimitiveExpression(
                unwrappedExpression.consequent,
                sourceCode
            ) &&
            isStaticallyPrimitiveExpression(
                unwrappedExpression.alternate,
                sourceCode
            )
        );
    }

    if (unwrappedExpression.type === AST_NODE_TYPES.LogicalExpression) {
        return (
            isStaticallyPrimitiveExpression(
                unwrappedExpression.left,
                sourceCode
            ) &&
            isStaticallyPrimitiveExpression(
                unwrappedExpression.right,
                sourceCode
            )
        );
    }

    if (unwrappedExpression.type === AST_NODE_TYPES.SequenceExpression) {
        const finalExpression = arrayAt(unwrappedExpression.expressions, -1);

        return (
            isDefined(finalExpression) &&
            isStaticallyPrimitiveExpression(finalExpression, sourceCode)
        );
    }

    return false;
};

const isNativeAttributeAllowed = (
    node: Readonly<es.JSXAttribute>,
    option: Readonly<JsxPropRuleOption>
): boolean => {
    const elementName = getSimpleJsxElementName(node.parent);

    if (!isDefined(elementName) || !isIntrinsicJsxName(elementName)) {
        return false;
    }

    const allowedAttributeNames = option.nativeAllowList;

    if (allowedAttributeNames === "all") {
        return true;
    }

    const attributeName = getJsxAttributeName(node);

    if (!isDefined(attributeName) || !isDefined(allowedAttributeNames)) {
        return false;
    }

    return allowedAttributeNames.some(
        (allowedName) =>
            allowedName.toLowerCase() === attributeName.toLowerCase()
    );
};

const collectMatchingExpressions = (
    expression: Readonly<es.Expression>,
    sourceCode: Readonly<TSESLint.SourceCode>,
    matcher: StabilityMatcher,
    visitedExpressions: Set<Readonly<es.Expression>>
): readonly Readonly<es.Expression>[] => {
    const unwrappedExpression = unwrapExpression(expression);

    if (containsExpression(visitedExpressions, unwrappedExpression)) {
        return [];
    }

    visitedExpressions.add(unwrappedExpression);

    if (matcher(unwrappedExpression, sourceCode)) {
        return [unwrappedExpression];
    }

    if (unwrappedExpression.type === AST_NODE_TYPES.LogicalExpression) {
        return [
            ...collectMatchingExpressions(
                unwrappedExpression.left,
                sourceCode,
                matcher,
                visitedExpressions
            ),
            ...collectMatchingExpressions(
                unwrappedExpression.right,
                sourceCode,
                matcher,
                visitedExpressions
            ),
        ];
    }

    if (unwrappedExpression.type === AST_NODE_TYPES.ConditionalExpression) {
        return [
            ...collectMatchingExpressions(
                unwrappedExpression.consequent,
                sourceCode,
                matcher,
                visitedExpressions
            ),
            ...collectMatchingExpressions(
                unwrappedExpression.alternate,
                sourceCode,
                matcher,
                visitedExpressions
            ),
        ];
    }

    if (unwrappedExpression.type === AST_NODE_TYPES.SequenceExpression) {
        const finalExpression = arrayAt(unwrappedExpression.expressions, -1);

        return isDefined(finalExpression)
            ? collectMatchingExpressions(
                  finalExpression,
                  sourceCode,
                  matcher,
                  visitedExpressions
              )
            : [];
    }

    if (unwrappedExpression.type === AST_NODE_TYPES.Identifier) {
        const initializer = getSameFunctionConstInitializer(
            sourceCode,
            unwrappedExpression
        );

        return isDefined(initializer)
            ? collectMatchingExpressions(
                  initializer,
                  sourceCode,
                  matcher,
                  visitedExpressions
              )
            : [];
    }

    return [];
};

/** Build the shared conservative JSX-attribute visitor used by perf rules. */
export const createJsxPropStabilityVisitor = ({
    context,
    matcher,
    options,
    report,
}: VisitorArguments): TSESLint.RuleListener => {
    const reportedNodes = new Set<Readonly<es.Expression>>();

    return {
        JSXAttribute: (node: Readonly<es.JSXAttribute>): void => {
            if (
                node.value?.type !== AST_NODE_TYPES.JSXExpressionContainer ||
                node.value.expression.type ===
                    AST_NODE_TYPES.JSXEmptyExpression ||
                isNativeAttributeAllowed(node, options) ||
                !isDefined(getEnclosingFunction(context.sourceCode, node))
            ) {
                return;
            }

            const matches = collectMatchingExpressions(
                node.value.expression,
                context.sourceCode,
                matcher,
                new Set()
            );

            for (const match of matches) {
                if (containsExpression(reportedNodes, match)) {
                    continue;
                }

                reportedNodes.add(match);
                report(match);
            }
        },
    };
};

/** Match an unshadowed built-in constructor call or construction. */
export const isBuiltinAllocation = (
    expression: Readonly<es.Expression>,
    sourceCode: Readonly<TSESLint.SourceCode>,
    constructorName:
        | "Array"
        | "Function"
        | "Object"
): boolean => {
    if (
        expression.type !== AST_NODE_TYPES.CallExpression &&
        expression.type !== AST_NODE_TYPES.NewExpression
    ) {
        return false;
    }

    if (expression.callee.type !== AST_NODE_TYPES.Identifier) {
        return false;
    }

    if (
        expression.callee.name !== constructorName ||
        !isUnshadowedGlobalIdentifier(sourceCode, expression.callee)
    ) {
        return false;
    }

    if (constructorName !== "Object") {
        return true;
    }

    const firstArgument = arrayAt(expression.arguments, 0);

    return (
        !isDefined(firstArgument) ||
        (firstArgument.type !== AST_NODE_TYPES.SpreadElement &&
            isStaticallyPrimitiveExpression(firstArgument, sourceCode))
    );
};

/** Match a call to `.bind`, which always creates a new bound function. */
export const isBindCall = (expression: Readonly<es.Expression>): boolean =>
    expression.type === AST_NODE_TYPES.CallExpression &&
    expression.callee.type === AST_NODE_TYPES.MemberExpression &&
    ((expression.callee.computed &&
        expression.callee.property.type === AST_NODE_TYPES.Literal &&
        expression.callee.property.value === "bind") ||
        (!expression.callee.computed &&
            expression.callee.property.type === AST_NODE_TYPES.Identifier &&
            expression.callee.property.name === "bind"));

export type { JsxPropRuleOption, JsxPropRuleOptions, StabilityMatcher };
