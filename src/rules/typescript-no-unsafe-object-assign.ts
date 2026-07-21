import {
    getConstrainedTypeAtLocation,
    isTypeFlagSet,
} from "@typescript-eslint/type-utils";
import { type TSESTree as es, ESLintUtils } from "@typescript-eslint/utils";
import { isDefined } from "ts-extras";
import * as tsutils from "tsutils";
import ts from "typescript";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden";

type Options = readonly [];

const getUnionPropertyNames = (
    checker: Readonly<ts.TypeChecker>,
    type: Readonly<ts.Type>
): ReadonlySet<ts.__String> => {
    const propertyNames = new Set<ts.__String>();

    for (const typePart of tsutils.unionTypeParts(type)) {
        for (const property of checker.getPropertiesOfType(typePart)) {
            propertyNames.add(property.getEscapedName());
        }
    }

    return propertyNames;
};

const getUnionIndexInfos = (
    checker: Readonly<ts.TypeChecker>,
    type: Readonly<ts.Type>
): readonly ts.IndexInfo[] =>
    tsutils
        .unionTypeParts(type)
        .flatMap((typePart) => checker.getIndexInfosOfType(typePart));

const getPropertyKeyTypes = (
    checker: Readonly<ts.TypeChecker>,
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- TypeScript escaped property names are branded primitive strings.
    propertyName: ts.__String
): readonly ts.Type[] => {
    const propertyNameText = String(propertyName);

    if (propertyNameText.startsWith("__@")) {
        return [checker.getESSymbolType()];
    }

    if (tsutils.isNumericPropertyName(propertyName)) {
        return [
            checker.getNumberLiteralType(Number(propertyNameText)),
            checker.getStringLiteralType(propertyNameText),
        ];
    }

    return [checker.getStringLiteralType(propertyNameText)];
};

const indexInfoMayWriteProperty = (
    checker: Readonly<ts.TypeChecker>,
    indexInfo: Readonly<ts.IndexInfo>,
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- TypeScript escaped property names are branded primitive strings.
    propertyName: ts.__String
): boolean =>
    getPropertyKeyTypes(checker, propertyName).some((propertyKeyType) =>
        checker.isTypeAssignableTo(propertyKeyType, indexInfo.keyType)
    );

const indexKeyTypesMayOverlap = (
    checker: Readonly<ts.TypeChecker>,
    leftKeyType: Readonly<ts.Type>,
    rightKeyType: Readonly<ts.Type>
): boolean => {
    for (const leftPart of tsutils.unionTypeParts(leftKeyType)) {
        for (const rightPart of tsutils.unionTypeParts(rightKeyType)) {
            if (
                checker.isTypeAssignableTo(leftPart, rightPart) ||
                checker.isTypeAssignableTo(rightPart, leftPart)
            ) {
                return true;
            }

            const leftIsStringLike = isTypeFlagSet(
                leftPart,
                ts.TypeFlags.StringLike
            );
            const rightIsStringLike = isTypeFlagSet(
                rightPart,
                ts.TypeFlags.StringLike
            );
            const leftIsNumberLike = isTypeFlagSet(
                leftPart,
                ts.TypeFlags.NumberLike
            );
            const rightIsNumberLike = isTypeFlagSet(
                rightPart,
                ts.TypeFlags.NumberLike
            );

            if (
                (leftIsStringLike && rightIsStringLike) ||
                (leftIsNumberLike && rightIsNumberLike) ||
                (isTypeFlagSet(leftPart, ts.TypeFlags.ESSymbolLike) &&
                    isTypeFlagSet(rightPart, ts.TypeFlags.ESSymbolLike)) ||
                (rightIsNumberLike &&
                    isTypeFlagSet(leftPart, ts.TypeFlags.String)) ||
                (leftIsNumberLike &&
                    isTypeFlagSet(rightPart, ts.TypeFlags.String))
            ) {
                return true;
            }
        }
    }

    return false;
};

/**
 * Disallow Object.assign sources that may overwrite readonly target keys.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => {
        const parserServices = ESLintUtils.getParserServices(context);
        const checker = parserServices.program.getTypeChecker();

        return {
            "CallExpression[callee.type='MemberExpression'][callee.object.type='Identifier'][callee.object.name='Object'][callee.property.type='Identifier'][callee.property.name='assign']":
                (node: Readonly<es.CallExpression>): void => {
                    const [target, ...sources] = node.arguments;
                    if (target === undefined || sources.length === 0) {
                        return;
                    }

                    const targetType = getConstrainedTypeAtLocation(
                        parserServices,
                        target
                    );
                    const targetPropertyNames = getUnionPropertyNames(
                        checker,
                        targetType
                    );
                    const targetPropertyNameList = [...targetPropertyNames];
                    const targetIndexInfos = getUnionIndexInfos(
                        checker,
                        targetType
                    );
                    const readonlyTargetPropertyCache = new Map<
                        ts.__String,
                        boolean
                    >();

                    const isReadonlyTargetProperty = (
                        // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- TypeScript escaped property names are branded primitive strings.
                        propertyName: ts.__String
                    ): boolean => {
                        const cachedResult =
                            readonlyTargetPropertyCache.get(propertyName);
                        if (isDefined(cachedResult)) {
                            return cachedResult;
                        }

                        const isReadonly = tsutils
                            .unionTypeParts(targetType)
                            .some((targetPart) => {
                                if (
                                    isDefined(
                                        tsutils.getPropertyOfType(
                                            targetPart,
                                            propertyName
                                        )
                                    )
                                ) {
                                    return tsutils.isPropertyReadonlyInType(
                                        targetPart,
                                        propertyName,
                                        checker
                                    );
                                }

                                return checker
                                    .getIndexInfosOfType(targetPart)
                                    .some(
                                        (targetIndexInfo) =>
                                            targetIndexInfo.isReadonly &&
                                            indexInfoMayWriteProperty(
                                                checker,
                                                targetIndexInfo,
                                                propertyName
                                            )
                                    );
                            });

                        readonlyTargetPropertyCache.set(
                            propertyName,
                            isReadonly
                        );

                        return isReadonly;
                    };

                    const readonlyTargetIndexInfos = targetIndexInfos.filter(
                        (targetIndexInfo) => targetIndexInfo.isReadonly
                    );
                    const targetHasReadonlyKey = (): boolean =>
                        targetPropertyNameList.some((targetPropertyName) =>
                            isReadonlyTargetProperty(targetPropertyName)
                        ) || readonlyTargetIndexInfos.length > 0;

                    const sourceMayWriteReadonlyTargetKey = (
                        source: Readonly<es.CallExpressionArgument>
                    ): boolean => {
                        const sourceType = getConstrainedTypeAtLocation(
                            parserServices,
                            source
                        );

                        if (isTypeFlagSet(sourceType, ts.TypeFlags.Any)) {
                            return targetHasReadonlyKey();
                        }

                        return tsutils
                            .unionTypeParts(sourceType)
                            .some((sourcePart) => {
                                if (
                                    checker
                                        .getPropertiesOfType(sourcePart)
                                        .some((sourceProperty) =>
                                            isReadonlyTargetProperty(
                                                sourceProperty.getEscapedName()
                                            )
                                        )
                                ) {
                                    return true;
                                }

                                const sourceIndexInfos =
                                    checker.getIndexInfosOfType(sourcePart);

                                return sourceIndexInfos.some(
                                    (sourceIndexInfo) =>
                                        targetPropertyNameList.some(
                                            (targetPropertyName) =>
                                                isReadonlyTargetProperty(
                                                    targetPropertyName
                                                ) &&
                                                indexInfoMayWriteProperty(
                                                    checker,
                                                    sourceIndexInfo,
                                                    targetPropertyName
                                                )
                                        ) ||
                                        readonlyTargetIndexInfos.some(
                                            (targetIndexInfo) =>
                                                indexKeyTypesMayOverlap(
                                                    checker,
                                                    sourceIndexInfo.keyType,
                                                    targetIndexInfo.keyType
                                                )
                                        )
                                );
                            });
                    };

                    if (
                        sources.every(
                            (source) => !sourceMayWriteReadonlyTargetKey(source)
                        )
                    ) {
                        return;
                    }

                    context.report({
                        messageId: "forbidden",
                        node,
                    });
                },
        };
    },
    meta: {
        deprecated: false,
        docs: {
            deprecated: false,
            description:
                "disallow Object.assign sources that may overwrite readonly target keys.",
            frozen: false,
            recommended: false,
            requiresTypeChecking: true,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-no-unsafe-object-assign",
        },
        hasSuggestions: false,
        languages: ["js/js"],
        messages: {
            forbidden:
                "Object.assign source may overwrite a readonly target property.",
        },
        schema: [],
        type: "problem",
    },
    name: "typescript/no-unsafe-object-assign",
});

export default rule;
