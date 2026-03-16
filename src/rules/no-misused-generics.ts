import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";
import type * as ts from "typescript";

import { ESLintUtils } from "@typescript-eslint/utils";
import { isDefined } from "ts-extras";
import * as tsutils from "tsutils";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "cannotInfer" | "canReplace";

type Options = readonly [];

type VariableInfo = NonNullable<ReturnType<VariableUsageMap["get"]>>;

type VariableUsageMap = ReturnType<typeof tsutils.collectVariableUsage>;

type VariableUse = VariableInfo["uses"][number];

const getVariableUses = (
    usageMap: Readonly<VariableUsageMap>,
    identifier: Readonly<ts.Identifier>
): readonly VariableUse[] => usageMap.get(identifier)?.uses ?? [];

const toReportLocation = (
    sourceCode: Readonly<TSESLint.SourceCode>,
    sourceFile: Readonly<ts.SourceFile>,
    node: Readonly<ts.Node>
): es.SourceLocation => {
    const start = sourceCode.getLocFromIndex(node.getStart(sourceFile));
    const end = sourceCode.getLocFromIndex(node.getEnd());

    return {
        end: {
            column: end.column,
            line: end.line,
        },
        start: {
            column: start.column,
            line: start.line,
        },
    } satisfies es.SourceLocation;
};

const isTypeUseInsideConstraint = (
    useLocation: Readonly<ts.Identifier>,
    typeParameters: readonly Readonly<ts.TypeParameterDeclaration>[]
): boolean =>
    typeParameters.some((typeParameter) => {
        const { constraint } = typeParameter;
        if (!isDefined(constraint)) {
            return false;
        }

        return (
            useLocation.pos >= constraint.pos &&
            useLocation.pos < constraint.end
        );
    });

const isConstrainedByAnotherTypeParameter = (
    currentTypeParameter: Readonly<ts.TypeParameterDeclaration>,
    allTypeParameters: readonly Readonly<ts.TypeParameterDeclaration>[],
    usageMap: Readonly<VariableUsageMap>
): boolean => {
    const { constraint } = currentTypeParameter;
    if (!isDefined(constraint)) {
        return false;
    }

    return allTypeParameters.some((otherTypeParameter) => {
        if (otherTypeParameter === currentTypeParameter) {
            return false;
        }

        const uses = getVariableUses(usageMap, otherTypeParameter.name);

        return uses.some(
            (use) =>
                use.location.pos >= constraint.pos &&
                use.location.pos < constraint.end
        );
    });
};

const isUseWithinParameterRange = (
    usePosition: number,
    signature: Readonly<ts.SignatureDeclaration>
): boolean =>
    usePosition > signature.parameters.pos &&
    usePosition < signature.parameters.end;

const getTypeParameterReplacement = (
    sourceFile: Readonly<ts.SourceFile>,
    typeParameter: Readonly<ts.TypeParameterDeclaration>
): string => {
    const { constraint } = typeParameter;
    if (!isDefined(constraint)) {
        return "unknown";
    }

    return constraint.getText(sourceFile);
};

/**
 * Disallow type parameters that cannot be inferred or do not enforce
 * constraints.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => {
        const parserServices = ESLintUtils.getParserServices(context);
        let usageMap: null | VariableUsageMap = null;

        const checkTypeParameters = (
            typeParameters: readonly Readonly<ts.TypeParameterDeclaration>[],
            signature: Readonly<ts.SignatureDeclaration>
        ): void => {
            if (usageMap === null) {
                usageMap = tsutils.collectVariableUsage(
                    signature.getSourceFile()
                );
            }

            const sourceFile = signature.getSourceFile();

            for (const typeParameter of typeParameters) {
                const uses = getVariableUses(usageMap, typeParameter.name);
                let appearsInMultipleParameters = false;
                let usedInParameters = false;
                let usedInReturnOrExtends =
                    tsutils.isFunctionWithBody(signature);

                for (const use of uses) {
                    if (
                        isUseWithinParameterRange(use.location.pos, signature)
                    ) {
                        if (usedInParameters) {
                            appearsInMultipleParameters = true;
                            break;
                        }

                        usedInParameters = true;
                        continue;
                    }

                    if (usedInReturnOrExtends) {
                        continue;
                    }

                    usedInReturnOrExtends =
                        use.location.pos > signature.parameters.end ||
                        isTypeUseInsideConstraint(use.location, typeParameters);
                }

                if (appearsInMultipleParameters) {
                    continue;
                }

                if (!usedInParameters) {
                    context.report({
                        data: {
                            name: typeParameter.name.text,
                        },
                        loc: toReportLocation(
                            context.sourceCode,
                            sourceFile,
                            typeParameter
                        ),
                        messageId: "cannotInfer",
                    });
                    continue;
                }

                if (
                    !usedInReturnOrExtends &&
                    usageMap !== null &&
                    !isConstrainedByAnotherTypeParameter(
                        typeParameter,
                        typeParameters,
                        usageMap
                    )
                ) {
                    context.report({
                        data: {
                            name: typeParameter.name.text,
                            replacement: getTypeParameterReplacement(
                                sourceFile,
                                typeParameter
                            ),
                        },
                        loc: toReportLocation(
                            context.sourceCode,
                            sourceFile,
                            typeParameter
                        ),
                        messageId: "canReplace",
                    });
                }
            }
        };

        const checkSignature = (node: Readonly<es.Node>): void => {
            const tsNode = parserServices.esTreeNodeToTSNodeMap.get(node);
            if (
                !tsutils.isSignatureDeclaration(tsNode) ||
                !isDefined(tsNode.typeParameters)
            ) {
                return;
            }

            checkTypeParameters(tsNode.typeParameters, tsNode);
        };

        return {
            ArrowFunctionExpression: checkSignature,
            FunctionDeclaration: checkSignature,
            FunctionExpression: checkSignature,
            MethodDefinition: checkSignature,
            "Program:exit": () => {
                usageMap = null;
            },
            TSCallSignatureDeclaration: checkSignature,
            TSConstructorType: checkSignature,
            TSConstructSignatureDeclaration: checkSignature,
            TSDeclareFunction: checkSignature,
            TSFunctionType: checkSignature,
            TSIndexSignature: checkSignature,
            TSMethodSignature: checkSignature,
            TSPropertySignature: checkSignature,
        };
    },
    defaultOptions: [],
    meta: {
        deprecated: false,
        docs: {
            deprecated: false,
            description:
                "disallow type parameters that cannot be inferred or do not enforce constraints.",
            frozen: false,
            recommended: false,
            requiresTypeChecking: true,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-misused-generics",
        },
        hasSuggestions: false,
        messages: {
            cannotInfer:
                "Type parameter '{{name}}' cannot be inferred from any parameter.",
            canReplace:
                "Type parameter '{{name}}' does not enforce a relation between types and can be replaced with '{{replacement}}'.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-misused-generics",
});

export default rule;
