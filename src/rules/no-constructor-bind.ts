import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import { arrayFirst, arrayLast } from "ts-extras";

import {
    getDirectConstructorAssignments,
    getStaticThisMemberName,
} from "../_internal/constructor-migration.js";
import { ruleCreator } from "../_internal/rule-creator.js";

type BoundMethodAssignment = Readonly<{
    readonly methodName: string;
}>;

type MessageIds = "convertToArrowField" | "preferArrowField";
type Options = readonly [];

const getBoundMethodAssignment = (
    assignment: Readonly<es.AssignmentExpression>
): BoundMethodAssignment | null => {
    const assignedName = getStaticThisMemberName(assignment.left);
    if (
        assignedName === null ||
        assignment.right.type !== AST_NODE_TYPES.CallExpression ||
        assignment.right.optional ||
        assignment.right.arguments.length !== 1 ||
        arrayFirst(assignment.right.arguments)?.type !==
            AST_NODE_TYPES.ThisExpression
    ) {
        return null;
    }

    const bindMember = assignment.right.callee;
    if (
        bindMember.type !== AST_NODE_TYPES.MemberExpression ||
        bindMember.computed ||
        bindMember.optional ||
        bindMember.property.type !== AST_NODE_TYPES.Identifier ||
        bindMember.property.name !== "bind"
    ) {
        return null;
    }

    const boundName = getStaticThisMemberName(bindMember.object);
    return boundName === assignedName ? { methodName: assignedName } : null;
};

const getConvertibleMethod = (
    constructorDefinition: Readonly<es.MethodDefinition>,
    methodName: string,
    sourceCode: Readonly<TSESLint.SourceCode>
): es.MethodDefinition | null => {
    const classBody = constructorDefinition.parent;
    const method = classBody.body.find(
        (element): element is es.MethodDefinition =>
            element.type === AST_NODE_TYPES.MethodDefinition &&
            element.kind === "method" &&
            !element.computed &&
            element.key.type === AST_NODE_TYPES.Identifier &&
            element.key.name === methodName
    );

    if (method === undefined) {
        return null;
    }

    const body = method.value.body;
    if (
        body === null ||
        method.value.generator ||
        method.static ||
        method.decorators.length > 0
    ) {
        return null;
    }

    const prefix = sourceCode.text
        .slice(arrayFirst(method.range), arrayFirst(method.key.range))
        .trim();
    if (prefix !== "" && prefix !== "async") {
        return null;
    }

    const parametersAndReturnType = sourceCode.text
        .slice(arrayLast(method.key.range), arrayFirst(body.range))
        .trim();
    if (!parametersAndReturnType.startsWith("(")) {
        return null;
    }

    const bodyText = sourceCode.getText(body);
    if (/\b(?:arguments|super|yield)\b|\bnew\s*\.\s*target\b/v.test(bodyText)) {
        return null;
    }

    return method;
};

const buildSuggestion = (
    fixer: TSESLint.RuleFixer,
    statement: Readonly<es.ExpressionStatement>,
    method: Readonly<es.MethodDefinition>,
    sourceCode: Readonly<TSESLint.SourceCode>
): readonly TSESLint.RuleFix[] => {
    const body = method.value.body;
    if (body === null) {
        return [];
    }

    const parametersAndReturnType = sourceCode.text
        .slice(arrayLast(method.key.range), arrayFirst(body.range))
        .trim();
    const bodyText = sourceCode.getText(body);
    const keyText = sourceCode.getText(method.key);
    const asyncPrefix = method.value.async ? "async " : "";

    return [
        fixer.remove(statement),
        fixer.replaceText(
            method,
            `${keyText} = ${asyncPrefix}${parametersAndReturnType} => ${bodyText}`
        ),
    ];
};

/**
 * Discourage binding a class method to its instance in the constructor.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => ({
        "MethodDefinition[kind='constructor']": (
            constructorDefinition: Readonly<es.MethodDefinition>
        ): void => {
            for (const {
                assignment,
                statement,
            } of getDirectConstructorAssignments(constructorDefinition)) {
                const binding = getBoundMethodAssignment(assignment);
                if (binding === null) {
                    continue;
                }

                const method = getConvertibleMethod(
                    constructorDefinition,
                    binding.methodName,
                    context.sourceCode
                );

                if (
                    method === null ||
                    context.sourceCode.getCommentsInside(statement).length > 0
                ) {
                    context.report({
                        data: { methodName: binding.methodName },
                        messageId: "preferArrowField",
                        node: assignment,
                    });
                } else {
                    context.report({
                        data: { methodName: binding.methodName },
                        messageId: "preferArrowField",
                        node: assignment,
                        suggest: [
                            {
                                data: { methodName: binding.methodName },
                                fix: (fixer) =>
                                    buildSuggestion(
                                        fixer,
                                        statement,
                                        method,
                                        context.sourceCode
                                    ),
                                messageId: "convertToArrowField",
                            },
                        ],
                    });
                }
            }
        },
    }),
    meta: {
        deprecated: false,
        docs: {
            deprecated: false,
            description:
                "disallow binding class methods in constructors when an instance arrow field is preferred.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-constructor-bind",
        },
        hasSuggestions: true,
        messages: {
            convertToArrowField:
                "Convert '{{methodName}}' to an instance arrow-function field and remove the constructor binding.",
            preferArrowField:
                "Avoid binding '{{methodName}}' in the constructor; prefer an instance arrow-function field when its semantics are acceptable.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "no-constructor-bind",
});

export default rule;
