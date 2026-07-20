import {
    AST_NODE_TYPES,
    type TSESTree as es,
    TSESLint,
} from "@typescript-eslint/utils";
import { arrayAt, arrayFirst, isDefined, setHas } from "ts-extras";

import {
    findVariable,
    getStaticClassMemberName,
} from "../_internal/jsx-react-analysis.js";
import { ruleCreator } from "../_internal/rule-creator.js";

type ClassNode = es.ClassDeclaration | es.ClassExpression;

interface ClassState {
    hasErrorBoundaryMethod: boolean;
    hasJsx: boolean;
    hasRenderMethod: boolean;
    readonly isKnownReactComponent: boolean;
    readonly node: Readonly<ClassNode>;
}

type MessageIds = "preferFunctionComponent";

type Options = readonly [RuleOption?];

type RuleOption = Readonly<{
    readonly allowErrorBoundary?: boolean;
    readonly allowJsxUtilityClass?: boolean;
}>;

const defaultOptions: Options = [
    {
        allowErrorBoundary: true,
        allowJsxUtilityClass: false,
    },
];

const supportedComponentSources: ReadonlySet<string> = new Set([
    "inferno",
    "preact",
    "preact/compat",
    "react",
]);

const componentBaseExportNames: ReadonlySet<string> = new Set([
    "Component",
    "PureComponent",
]);

const getImportedName = (
    specifier: Readonly<es.ImportSpecifier>
): string | undefined =>
    specifier.imported.type === AST_NODE_TYPES.Identifier
        ? specifier.imported.name
        : typeof specifier.imported.value === "string"
          ? specifier.imported.value
          : undefined;

const getSupportedImportBinding = (
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
        !setHas(supportedComponentSources, definition.parent.source.value) ||
        definition.node.type === AST_NODE_TYPES.TSImportEqualsDeclaration
    ) {
        return undefined;
    }

    return definition.node;
};

const isDirectComponentBase = (
    sourceCode: Readonly<TSESLint.SourceCode>,
    identifier: Readonly<es.Identifier>
): boolean => {
    const binding = getSupportedImportBinding(sourceCode, identifier);

    return (
        binding?.type === AST_NODE_TYPES.ImportSpecifier &&
        binding.importKind !== "type" &&
        setHas(componentBaseExportNames, getImportedName(binding) ?? "")
    );
};

const isComponentNamespace = (
    sourceCode: Readonly<TSESLint.SourceCode>,
    identifier: Readonly<es.Identifier>
): boolean => {
    const binding = getSupportedImportBinding(sourceCode, identifier);

    return (
        binding?.type === AST_NODE_TYPES.ImportDefaultSpecifier ||
        binding?.type === AST_NODE_TYPES.ImportNamespaceSpecifier
    );
};

const isKnownReactComponent = (
    node: Readonly<ClassNode>,
    sourceCode: Readonly<TSESLint.SourceCode>
): boolean => {
    const superClass = node.superClass;

    if (superClass === null) {
        return false;
    }

    if (superClass.type === AST_NODE_TYPES.Identifier) {
        return isDirectComponentBase(sourceCode, superClass);
    }

    return (
        superClass.type === AST_NODE_TYPES.MemberExpression &&
        !superClass.computed &&
        superClass.object.type === AST_NODE_TYPES.Identifier &&
        isComponentNamespace(sourceCode, superClass.object) &&
        superClass.property.type === AST_NODE_TYPES.Identifier &&
        setHas(componentBaseExportNames, superClass.property.name)
    );
};

/** Prefer function components while preserving class-only error boundaries. */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context, [configuredOption]) => {
        const option: RuleOption = {
            allowErrorBoundary: true,
            allowJsxUtilityClass: false,
            ...configuredOption,
        };
        const classStack: ClassState[] = [];

        const enterClass = (node: Readonly<ClassNode>): void => {
            classStack.push({
                hasErrorBoundaryMethod: false,
                hasJsx: false,
                hasRenderMethod: false,
                isKnownReactComponent: isKnownReactComponent(
                    node,
                    context.sourceCode
                ),
                node,
            });
        };

        const exitClass = (): void => {
            const state = classStack.pop();

            if (!isDefined(state)) {
                return;
            }

            const isComponent =
                state.isKnownReactComponent ||
                (state.hasJsx &&
                    (state.hasRenderMethod ||
                        option.allowJsxUtilityClass !== true));

            if (
                !isComponent ||
                (option.allowErrorBoundary !== false &&
                    state.hasErrorBoundaryMethod)
            ) {
                return;
            }

            context.report({
                messageId: "preferFunctionComponent",
                node: state.node.id ?? state.node,
            });
        };

        const markJsx = (): void => {
            const state = arrayAt(classStack, -1);

            if (isDefined(state)) {
                state.hasJsx = true;
            }
        };

        return {
            ClassDeclaration: enterClass,
            "ClassDeclaration:exit": exitClass,
            ClassExpression: enterClass,
            "ClassExpression:exit": exitClass,
            JSXElement: markJsx,
            JSXFragment: markJsx,
            MethodDefinition: (node: Readonly<es.MethodDefinition>): void => {
                const state = arrayAt(classStack, -1);

                if (!isDefined(state)) {
                    return;
                }

                const memberName = getStaticClassMemberName(node);

                if (memberName === "render" && !node.static) {
                    state.hasRenderMethod = true;
                }

                if (
                    (memberName === "componentDidCatch" && !node.static) ||
                    (memberName === "getDerivedStateFromError" && node.static)
                ) {
                    state.hasErrorBoundaryMethod = true;
                }
            },
        };
    },
    defaultOptions,
    meta: {
        defaultOptions: [
            {
                allowErrorBoundary: true,
                allowJsxUtilityClass: false,
            },
        ],
        deprecated: false,
        docs: {
            deprecated: false,
            description:
                "require React-style components to use functions when class-only APIs are unnecessary.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/react-prefer-function-component",
        },
        hasSuggestions: false,
        messages: {
            preferFunctionComponent:
                "Write this class component as a function component; keep a class only when a class-only React API is required.",
        },
        schema: [
            {
                additionalProperties: false,
                description:
                    "Configuration for class-only APIs and JSX utility classes.",
                properties: {
                    allowErrorBoundary: {
                        description:
                            "Allow classes that implement a React error-boundary lifecycle.",
                        type: "boolean",
                    },
                    allowJsxUtilityClass: {
                        description:
                            "Allow non-component classes that produce JSX outside a render method.",
                        type: "boolean",
                    },
                },
                type: "object",
            },
        ],
        type: "suggestion",
    },
    name: "react-prefer-function-component",
});

export default rule;
