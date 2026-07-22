import type { ArrayElement } from "type-fest";

import { AST_NODE_TYPES, type TSESTree as es } from "@typescript-eslint/utils";
import { arrayFirst, isDefined, setHas } from "ts-extras";

import {
    findVariable,
    functionContainsJsx,
    getNamePolicy,
    isComponentName,
    unwrapExpression,
} from "../_internal/jsx-react-analysis.js";
import { ruleCreator } from "../_internal/rule-creator.js";
import { createDeprecatedRuleInfo } from "../_internal/rule-deprecation.js";

type ComponentFunction =
    | es.ArrowFunctionExpression
    | es.FunctionDeclaration
    | es.FunctionExpression;

type MessageIds = "memoRequired";

type Options = readonly [RuleOption?];

type ReactBindings = Readonly<{
    readonly forwardRefNames: ReadonlySet<string>;
    readonly memoNames: ReadonlySet<string>;
    readonly namespaces: ReadonlySet<string>;
}>;

type RuleOption = Readonly<{
    readonly ignoredComponents?: Readonly<Record<string, boolean>>;
}>;

const defaultOptions: Options = [{ ignoredComponents: {} }];

const containsComponentFunction = (
    functions: ReadonlySet<Readonly<ComponentFunction>>,
    node: Readonly<ComponentFunction>
): boolean => setHas(functions, node);

type ReactImportSpecifier = ArrayElement<es.ImportDeclaration["specifiers"]>;

const isRuntimeReactImport = (
    statement: Readonly<es.ProgramStatement>
): statement is es.ImportDeclaration =>
    statement.type === AST_NODE_TYPES.ImportDeclaration &&
    (statement.source.value === "react" ||
        statement.source.value === "preact/compat") &&
    statement.importKind !== "type";

const collectReactImportSpecifier = (
    specifier: Readonly<ReactImportSpecifier>,
    forwardRefNames: Set<string>,
    memoNames: Set<string>,
    namespaces: Set<string>
): void => {
    if (
        specifier.type === AST_NODE_TYPES.ImportDefaultSpecifier ||
        specifier.type === AST_NODE_TYPES.ImportNamespaceSpecifier
    ) {
        namespaces.add(specifier.local.name);
        return;
    }

    if (
        specifier.importKind === "type" ||
        specifier.imported.type !== AST_NODE_TYPES.Identifier
    ) {
        return;
    }

    if (specifier.imported.name === "memo") {
        memoNames.add(specifier.local.name);
    } else if (specifier.imported.name === "forwardRef") {
        forwardRefNames.add(specifier.local.name);
    }
};

const collectReactBindings = (program: Readonly<es.Program>): ReactBindings => {
    const forwardRefNames = new Set<string>();
    const memoNames = new Set<string>();
    const namespaces = new Set<string>();

    for (const statement of program.body) {
        if (!isRuntimeReactImport(statement)) {
            continue;
        }

        for (const specifier of statement.specifiers) {
            collectReactImportSpecifier(
                specifier,
                forwardRefNames,
                memoNames,
                namespaces
            );
        }
    }

    return { forwardRefNames, memoNames, namespaces };
};

const isNamedReactCall = (
    node: Readonly<es.CallExpression>,
    directNames: ReadonlySet<string>,
    namespaces: ReadonlySet<string>,
    memberName: "forwardRef" | "memo"
): boolean => {
    const callee = unwrapExpression(node.callee);

    if (callee.type === AST_NODE_TYPES.Identifier) {
        return setHas(directNames, callee.name);
    }

    return (
        callee.type === AST_NODE_TYPES.MemberExpression &&
        !callee.computed &&
        callee.object.type === AST_NODE_TYPES.Identifier &&
        setHas(namespaces, callee.object.name) &&
        callee.property.type === AST_NODE_TYPES.Identifier &&
        callee.property.name === memberName
    );
};

const getComponentFunction = (
    expression: Readonly<es.Expression>,
    bindings: Readonly<ReactBindings>
): Readonly<ComponentFunction> | undefined => {
    const unwrappedExpression = unwrapExpression(expression);

    if (
        unwrappedExpression.type === AST_NODE_TYPES.ArrowFunctionExpression ||
        unwrappedExpression.type === AST_NODE_TYPES.FunctionExpression
    ) {
        return unwrappedExpression;
    }

    if (
        unwrappedExpression.type !== AST_NODE_TYPES.CallExpression ||
        !isNamedReactCall(
            unwrappedExpression,
            bindings.forwardRefNames,
            bindings.namespaces,
            "forwardRef"
        )
    ) {
        return undefined;
    }

    const firstArgument = arrayFirst(unwrappedExpression.arguments);

    return isDefined(firstArgument) &&
        firstArgument.type !== AST_NODE_TYPES.SpreadElement
        ? getComponentFunction(firstArgument, bindings)
        : undefined;
};

/** Require exported function components to use React memoization explicitly. */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context, [configuredOption]) => {
        const ignoredComponents = configuredOption?.ignoredComponents ?? {};
        const reportedNodes = new Set<Readonly<ComponentFunction>>();
        let bindings: ReactBindings = {
            forwardRefNames: new Set(),
            memoNames: new Set(),
            namespaces: new Set(),
        };

        const isMemoizedExpression = (
            expression: Readonly<es.Expression>
        ): boolean => {
            const unwrappedExpression = unwrapExpression(expression);

            return (
                unwrappedExpression.type === AST_NODE_TYPES.CallExpression &&
                isNamedReactCall(
                    unwrappedExpression,
                    bindings.memoNames,
                    bindings.namespaces,
                    "memo"
                )
            );
        };

        const reportFunction = (
            name: string | undefined,
            node: Readonly<ComponentFunction>
        ): void => {
            if (
                node.params.length > 2 ||
                !functionContainsJsx(context.sourceCode, node) ||
                (isDefined(name) &&
                    (!isComponentName(name) ||
                        getNamePolicy(name, ignoredComponents) === true)) ||
                containsComponentFunction(reportedNodes, node)
            ) {
                return;
            }

            reportedNodes.add(node);
            context.report({
                data: { componentName: name ?? "default export" },
                messageId: "memoRequired",
                node:
                    node.type === AST_NODE_TYPES.FunctionDeclaration
                        ? (node.id ?? node)
                        : node,
            });
        };

        const inspectExpression = (
            name: string | undefined,
            expression: Readonly<es.Expression>
        ): void => {
            if (isMemoizedExpression(expression)) {
                return;
            }

            const componentFunction = getComponentFunction(
                expression,
                bindings
            );

            if (isDefined(componentFunction)) {
                reportFunction(name, componentFunction);
            }
        };

        const inspectIdentifier = (
            identifier: Readonly<es.Identifier>
        ): void => {
            const variable = findVariable(context.sourceCode, identifier);

            if (variable?.defs.length !== 1) {
                return;
            }

            const definitionNode = arrayFirst(variable.defs)?.node;

            if (definitionNode?.type === AST_NODE_TYPES.FunctionDeclaration) {
                reportFunction(identifier.name, definitionNode);
                return;
            }

            if (
                definitionNode?.type === AST_NODE_TYPES.VariableDeclarator &&
                definitionNode.init !== null
            ) {
                inspectExpression(identifier.name, definitionNode.init);
            }
        };

        const inspectNamedDeclaration = (
            declaration: Readonly<es.ExportNamedDeclaration>
        ): void => {
            if (
                declaration.declaration?.type ===
                AST_NODE_TYPES.FunctionDeclaration
            ) {
                const name = declaration.declaration.id?.name;

                if (isDefined(name)) {
                    reportFunction(name, declaration.declaration);
                }
                return;
            }

            if (
                declaration.declaration?.type ===
                AST_NODE_TYPES.VariableDeclaration
            ) {
                for (const declarator of declaration.declaration.declarations) {
                    if (
                        declarator.id.type === AST_NODE_TYPES.Identifier &&
                        declarator.init !== null
                    ) {
                        inspectExpression(declarator.id.name, declarator.init);
                    }
                }
                return;
            }

            if (declaration.source !== null) {
                return;
            }

            for (const specifier of declaration.specifiers) {
                inspectIdentifier(specifier.local);
            }
        };

        return {
            ExportDefaultDeclaration: (
                node: Readonly<es.ExportDefaultDeclaration>
            ): void => {
                if (node.declaration.type === AST_NODE_TYPES.Identifier) {
                    inspectIdentifier(node.declaration);
                    return;
                }

                if (
                    node.declaration.type === AST_NODE_TYPES.FunctionDeclaration
                ) {
                    reportFunction(node.declaration.id?.name, node.declaration);
                    return;
                }

                if (
                    node.declaration.type ===
                        AST_NODE_TYPES.ArrowFunctionExpression ||
                    node.declaration.type ===
                        AST_NODE_TYPES.FunctionExpression ||
                    node.declaration.type === AST_NODE_TYPES.CallExpression ||
                    node.declaration.type === AST_NODE_TYPES.ChainExpression
                ) {
                    inspectExpression(undefined, node.declaration);
                }
            },
            ExportNamedDeclaration: inspectNamedDeclaration,
            Program: (node: Readonly<es.Program>): void => {
                bindings = collectReactBindings(node);
            },
        };
    },
    defaultOptions,
    meta: {
        defaultOptions: [{ ignoredComponents: {} }],
        deprecated: createDeprecatedRuleInfo({
            availableUntil: "4.0.0",
            deprecatedSince: "2.0.0",
            message:
                "Deprecated because blanket React.memo requirements are not a sound performance policy and conflict with compiler-managed memoization.",
            ruleId: "require-memo",
        }),
        docs: {
            deprecated: true,
            description:
                "require exported function components to use explicit React memoization.",
            frozen: true,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/require-memo",
        },
        hasSuggestions: false,
        languages: ["js/js"],
        messages: {
            memoRequired:
                "Exported component '{{componentName}}' is not wrapped in React.memo(); add memoization only when profiling shows stable props make it beneficial.",
        },
        schema: [
            {
                additionalProperties: false,
                description:
                    "Configuration for exported components that do not require memoization.",
                properties: {
                    ignoredComponents: {
                        additionalProperties: {
                            description:
                                "Whether an exact component name or glob pattern is ignored.",
                            type: "boolean",
                        },
                        description:
                            "Exact component names and glob patterns mapped to ignore policies.",
                        type: "object",
                    },
                },
                type: "object",
            },
        ],
        type: "suggestion",
    },
    name: "require-memo",
});

export default rule;
