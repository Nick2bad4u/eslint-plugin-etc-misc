import {
    AST_NODE_TYPES,
    type TSESTree as es,
    type TSESLint,
} from "@typescript-eslint/utils";
import { arrayAt, isDefined } from "ts-extras";

import { getHtmlNestingViolation } from "../_internal/html-jsx-nesting.js";
import {
    getSimpleJsxElementName,
    isFunctionNode,
    isIntrinsicJsxName,
} from "../_internal/jsx-react-analysis.js";
import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds =
    | "invalidAncestor"
    | "invalidParent"
    | "voidParent";

type Options = readonly [RuleOption?];

type RuleOption = Readonly<{
    readonly checkVoidParents?: boolean;
}>;

const defaultOptions: Options = [{ checkVoidParents: false }];

const isTransparentArrayRenderCallback = (
    node: Readonly<
        | es.ArrowFunctionExpression
        | es.FunctionDeclaration
        | es.FunctionExpression
    >
): boolean => {
    if (node.type === AST_NODE_TYPES.FunctionDeclaration) {
        return false;
    }

    const parent = node.parent;

    if (
        parent.type !== AST_NODE_TYPES.CallExpression ||
        arrayAt(parent.arguments, 0) !== node ||
        parent.callee.type !== AST_NODE_TYPES.MemberExpression
    ) {
        return false;
    }

    const property = parent.callee.property;
    const methodName =
        !parent.callee.computed && property.type === AST_NODE_TYPES.Identifier
            ? property.name
            : parent.callee.computed &&
                property.type === AST_NODE_TYPES.Literal &&
                typeof property.value === "string"
              ? property.value
              : undefined;

    return methodName === "flatMap" || methodName === "map";
};

const isReturnedFromCallback = (
    ancestors: readonly Readonly<es.Node>[],
    functionIndex: number,
    callback: Readonly<
        | es.ArrowFunctionExpression
        | es.FunctionDeclaration
        | es.FunctionExpression
    >
): boolean => {
    if (callback.type === AST_NODE_TYPES.FunctionDeclaration) {
        return false;
    }

    if (
        callback.type === AST_NODE_TYPES.ArrowFunctionExpression &&
        callback.body.type !== AST_NODE_TYPES.BlockStatement
    ) {
        return true;
    }

    for (let index = functionIndex + 1; index < ancestors.length; index += 1) {
        if (ancestors[index]?.type === AST_NODE_TYPES.ReturnStatement) {
            return true;
        }
    }

    return false;
};

type AncestorTraversal =
    | Readonly<{ readonly kind: "collect"; readonly name: string }>
    | Readonly<{
          readonly kind:
              | "clear"
              | "skip"
              | "stop";
      }>;

const getAncestorTraversal = (
    ancestors: readonly Readonly<es.Node>[],
    index: number,
    ancestor: Readonly<es.Node>
): AncestorTraversal => {
    if (
        ancestor.type === AST_NODE_TYPES.JSXAttribute ||
        ancestor.type === AST_NODE_TYPES.JSXSpreadAttribute
    ) {
        return { kind: "clear" };
    }

    if (isFunctionNode(ancestor)) {
        return isTransparentArrayRenderCallback(ancestor) &&
            isReturnedFromCallback(ancestors, index, ancestor)
            ? { kind: "skip" }
            : { kind: "stop" };
    }

    if (
        ancestor.type === AST_NODE_TYPES.ClassDeclaration ||
        ancestor.type === AST_NODE_TYPES.ClassExpression
    ) {
        return { kind: "stop" };
    }

    if (ancestor.type !== AST_NODE_TYPES.JSXElement) {
        return { kind: "skip" };
    }

    const ancestorName = getSimpleJsxElementName(ancestor.openingElement);

    return isDefined(ancestorName) && isIntrinsicJsxName(ancestorName)
        ? { kind: "collect", name: ancestorName }
        : { kind: "stop" };
};

const getIntrinsicAncestorNames = (
    context: Readonly<TSESLint.RuleContext<MessageIds, Options>>,
    node: Readonly<es.JSXElement>
): readonly string[] => {
    const ancestors = context.sourceCode.getAncestors(node);
    const intrinsicAncestorNames: string[] = [];

    for (let index = ancestors.length - 1; index >= 0; index -= 1) {
        const ancestor = ancestors[index];

        if (!isDefined(ancestor)) {
            continue;
        }

        const traversal = getAncestorTraversal(ancestors, index, ancestor);

        if (traversal.kind === "clear") {
            return [];
        }

        if (traversal.kind === "stop") {
            break;
        }

        if (traversal.kind === "collect") {
            intrinsicAncestorNames.push(traversal.name);
        }
    }

    return intrinsicAncestorNames;
};

/** Validate deterministic HTML parent and ancestor relationships in JSX. */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context, [configuredOption]) => ({
        JSXElement: (node: Readonly<es.JSXElement>): void => {
            const childName = getSimpleJsxElementName(node.openingElement);

            if (!isDefined(childName) || !isIntrinsicJsxName(childName)) {
                return;
            }

            const ancestorNames = getIntrinsicAncestorNames(context, node);
            const violation = getHtmlNestingViolation(
                childName,
                ancestorNames,
                configuredOption?.checkVoidParents ?? false
            );

            if (!isDefined(violation)) {
                return;
            }

            const relatedName = violation.relatedName ?? "unknown";
            const messageId =
                violation.kind === "ancestor"
                    ? "invalidAncestor"
                    : violation.kind === "void-parent"
                      ? "voidParent"
                      : "invalidParent";

            context.report({
                data: { childName, relatedName },
                messageId,
                node: node.openingElement,
            });
        },
    }),
    defaultOptions,
    meta: {
        defaultOptions: [{ checkVoidParents: false }],
        deprecated: false,
        docs: {
            deprecated: false,
            description:
                "disallow deterministic invalid HTML parent and ancestor relationships in JSX.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-invalid-jsx-nesting",
        },
        hasSuggestions: false,
        languages: ["js/js"],
        messages: {
            invalidAncestor:
                "Do not render <{{childName}}> inside a <{{relatedName}}> ancestor; the HTML parser can produce a different DOM tree.",
            invalidParent:
                "<{{childName}}> is not valid directly inside <{{relatedName}}>; use the required HTML container element.",
            voidParent:
                "Void element <{{relatedName}}> cannot contain <{{childName}}>.",
        },
        schema: [
            {
                additionalProperties: false,
                description:
                    "Configuration for optional void-element parent validation.",
                properties: {
                    checkVoidParents: {
                        description:
                            "Report children written inside void JSX elements.",
                        type: "boolean",
                    },
                },
                type: "object",
            },
        ],
        type: "problem",
    },
    name: "no-invalid-jsx-nesting",
});

export default rule;
