import { AST_NODE_TYPES, type TSESTree as es } from "@typescript-eslint/utils";
import { arrayIncludes, isDefined, setHas } from "ts-extras";

import {
    getCallName,
    getEnclosingFunction,
    getJsxAttributeName,
    getNamePolicy,
    isComponentOpeningElement,
    isHookName,
} from "../_internal/jsx-react-analysis.js";
import {
    collectUnstableValues,
    isMemoHookCall,
    type UnstableValue,
} from "../_internal/react-memo-stability.js";
import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds =
    | "unstableHookArgument"
    | "unstableHookReturn"
    | "unstableProp";

type Options = readonly [RuleOption?];

type RuleOption = Readonly<{
    readonly checkHookCalls?: boolean;
    readonly checkHookReturnObject?: boolean;
    readonly ignoredHookCallsNames?: Readonly<Record<string, boolean>>;
    readonly ignoredPropNames?: readonly string[];
    readonly strict?: boolean;
}>;

const defaultOptions: Options = [
    {
        checkHookCalls: true,
        checkHookReturnObject: false,
        ignoredHookCallsNames: {},
        ignoredPropNames: [],
        strict: false,
    },
];

const containsMessageId = (
    messageIds: ReadonlySet<MessageIds>,
    messageId: MessageIds
): boolean => setHas(messageIds, messageId);

const defaultIgnoredHookCalls: Readonly<Record<string, boolean>> = {
    use: true,
    useCallback: true,
    useContext: true,
    useDebugValue: true,
    useDeferredValue: true,
    useEffect: true,
    useId: true,
    useImperativeHandle: true,
    useInfiniteQuery: true,
    useInsertionEffect: true,
    useLayoutEffect: true,
    useMemo: true,
    useMutation: true,
    useQuery: true,
    useQueryClient: true,
    useReducer: true,
    useRef: true,
    useState: true,
    useSyncExternalStore: true,
    useTransition: true,
};

const getFunctionName = (
    node: Readonly<
        | es.ArrowFunctionExpression
        | es.FunctionDeclaration
        | es.FunctionExpression
    >
): string | undefined => {
    if (node.type === AST_NODE_TYPES.FunctionDeclaration) {
        return node.id?.name;
    }

    return node.parent.type === AST_NODE_TYPES.VariableDeclarator &&
        node.parent.id.type === AST_NODE_TYPES.Identifier
        ? node.parent.id.name
        : undefined;
};

/**
 * Report unstable values at React prop and custom-hook boundaries without
 * generating dependency arrays or changing runtime behavior.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context, [configuredOption]) => {
        const option: Required<RuleOption> = {
            checkHookCalls: true,
            checkHookReturnObject: false,
            ignoredHookCallsNames: {},
            ignoredPropNames: [],
            strict: false,
            ...configuredOption,
        };
        const reportedByNode = new Map<
            Readonly<es.Expression>,
            Set<MessageIds>
        >();

        const reportValues = (
            values: readonly UnstableValue[],
            messageId: MessageIds
        ): void => {
            for (const value of values) {
                const reportedMessageIds = reportedByNode.get(value.node);

                if (
                    isDefined(reportedMessageIds) &&
                    containsMessageId(reportedMessageIds, messageId)
                ) {
                    continue;
                }

                if (isDefined(reportedMessageIds)) {
                    reportedMessageIds.add(messageId);
                } else {
                    reportedByNode.set(value.node, new Set([messageId]));
                }

                context.report({
                    data: { valueKind: value.kind },
                    messageId,
                    node: value.node,
                });
            }
        };

        const collect = (
            expression: Readonly<es.Expression>
        ): readonly UnstableValue[] =>
            collectUnstableValues(
                context.sourceCode,
                expression,
                option.strict
            );

        const reportHookReturn = (
            expression: Readonly<es.Expression>
        ): void => {
            if (
                expression.type === AST_NODE_TYPES.ObjectExpression &&
                !option.checkHookReturnObject
            ) {
                for (const property of expression.properties) {
                    if (property.type === AST_NODE_TYPES.Property) {
                        if (
                            property.value.type !==
                                AST_NODE_TYPES.AssignmentPattern &&
                            property.value.type !==
                                AST_NODE_TYPES.TSEmptyBodyFunctionExpression
                        ) {
                            reportValues(
                                collect(property.value),
                                "unstableHookReturn"
                            );
                        }
                    } else {
                        reportValues(
                            collect(property.argument),
                            "unstableHookReturn"
                        );
                    }
                }
                return;
            }

            reportValues(collect(expression), "unstableHookReturn");
        };

        const isCustomHookFunction = (
            node: Readonly<
                | es.ArrowFunctionExpression
                | es.FunctionDeclaration
                | es.FunctionExpression
            >
        ): boolean => {
            const functionName = getFunctionName(node);

            return isDefined(functionName) && isHookName(functionName);
        };

        return {
            "ArrowFunctionExpression[expression=true]": (
                node: Readonly<es.ArrowFunctionExpression>
            ): void => {
                if (
                    node.body.type !== AST_NODE_TYPES.BlockStatement &&
                    isCustomHookFunction(node)
                ) {
                    reportHookReturn(node.body);
                }
            },
            CallExpression: (node: Readonly<es.CallExpression>): void => {
                if (
                    !option.checkHookCalls ||
                    isMemoHookCall(context.sourceCode, node)
                ) {
                    return;
                }

                const hookName = getCallName(node);

                if (!isDefined(hookName) || !isHookName(hookName)) {
                    return;
                }

                const policy = getNamePolicy(hookName, {
                    ...defaultIgnoredHookCalls,
                    ...option.ignoredHookCallsNames,
                });

                if (policy === true) {
                    return;
                }

                for (const argument of node.arguments) {
                    if (argument.type !== AST_NODE_TYPES.SpreadElement) {
                        reportValues(collect(argument), "unstableHookArgument");
                    }
                }
            },
            JSXAttribute: (node: Readonly<es.JSXAttribute>): void => {
                if (
                    node.value?.type !==
                        AST_NODE_TYPES.JSXExpressionContainer ||
                    node.value.expression.type ===
                        AST_NODE_TYPES.JSXEmptyExpression ||
                    !isComponentOpeningElement(node.parent) ||
                    !isDefined(getEnclosingFunction(context.sourceCode, node))
                ) {
                    return;
                }

                const attributeName = getJsxAttributeName(node);

                if (
                    isDefined(attributeName) &&
                    arrayIncludes(option.ignoredPropNames, attributeName)
                ) {
                    return;
                }

                reportValues(collect(node.value.expression), "unstableProp");
            },
            ReturnStatement: (node: Readonly<es.ReturnStatement>): void => {
                if (node.argument === null) {
                    return;
                }

                const enclosingFunction = getEnclosingFunction(
                    context.sourceCode,
                    node
                );

                if (
                    !isDefined(enclosingFunction) ||
                    !isCustomHookFunction(enclosingFunction)
                ) {
                    return;
                }

                reportHookReturn(node.argument);
            },
        };
    },
    defaultOptions,
    meta: {
        defaultOptions: [
            {
                checkHookCalls: true,
                checkHookReturnObject: false,
                ignoredHookCallsNames: {},
                ignoredPropNames: [],
                strict: false,
            },
        ],
        deprecated: false,
        docs: {
            deprecated: false,
            description:
                "disallow render-local unstable values passed to components or custom hooks.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-unstable-react-values",
        },
        hasSuggestions: false,
        languages: ["js/js"],
        messages: {
            unstableHookArgument:
                "This {{valueKind}} value has a new identity on every invocation; stabilize it only if the custom hook requires referential equality.",
            unstableHookReturn:
                "This custom hook returns a render-local {{valueKind}} value with unstable identity; expose a stable value only when consumers require it.",
            unstableProp:
                "This {{valueKind}} prop has a new identity on every render; lift or memoize it only when the child relies on referential equality.",
        },
        schema: [
            {
                additionalProperties: false,
                description:
                    "Configuration for prop, custom-hook argument, and custom-hook return analysis.",
                properties: {
                    checkHookCalls: {
                        description:
                            "Report unstable arguments passed to custom hooks.",
                        type: "boolean",
                    },
                    checkHookReturnObject: {
                        description:
                            "Report a returned object as one unstable value instead of checking its property values.",
                        type: "boolean",
                    },
                    ignoredHookCallsNames: {
                        additionalProperties: {
                            description:
                                "Whether an exact hook name or glob pattern is ignored.",
                            type: "boolean",
                        },
                        description:
                            "Exact hook names and glob patterns mapped to ignore policies.",
                        type: "object",
                    },
                    ignoredPropNames: {
                        description:
                            "Component prop names excluded from identity analysis.",
                        items: {
                            description: "A component prop name to ignore.",
                            type: "string",
                        },
                        type: "array",
                        uniqueItems: true,
                    },
                    strict: {
                        description:
                            "Report calls, member expressions, and tagged templates whose identity cannot be proven stable.",
                        type: "boolean",
                    },
                },
                type: "object",
            },
        ],
        type: "suggestion",
    },
    name: "no-unstable-react-values",
});

export default rule;
