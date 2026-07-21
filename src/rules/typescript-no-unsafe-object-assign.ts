import {
    getConstrainedTypeAtLocation,
    isTypeFlagSet,
} from "@typescript-eslint/type-utils";
import {
    type TSESTree as es,
    ESLintUtils,
    type ParserServicesWithTypeInformation,
} from "@typescript-eslint/utils";
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

type ReadonlyTargetAnalysis = Readonly<{
    checker: Readonly<ts.TypeChecker>;
    propertyNames: readonly ts.__String[];
    readonlyIndexInfos: readonly ts.IndexInfo[];
    readonlyPropertyCache: Map<ts.__String, boolean>;
    type: Readonly<ts.Type>;
}>;

const createReadonlyTargetAnalysis = (
    checker: Readonly<ts.TypeChecker>,
    type: Readonly<ts.Type>
): ReadonlyTargetAnalysis => {
    const indexInfos = getUnionIndexInfos(checker, type);

    return {
        checker,
        propertyNames: [...getUnionPropertyNames(checker, type)],
        readonlyIndexInfos: indexInfos.filter(
            (indexInfo) => indexInfo.isReadonly
        ),
        readonlyPropertyCache: new Map(),
        type,
    };
};

const targetPartHasReadonlyProperty = (
    analysis: Readonly<ReadonlyTargetAnalysis>,
    targetPart: Readonly<ts.Type>,
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- TypeScript escaped property names are branded primitive strings.
    propertyName: ts.__String
): boolean => {
    if (isDefined(tsutils.getPropertyOfType(targetPart, propertyName))) {
        return tsutils.isPropertyReadonlyInType(
            targetPart,
            propertyName,
            analysis.checker
        );
    }

    return analysis.checker
        .getIndexInfosOfType(targetPart)
        .some(
            (indexInfo) =>
                indexInfo.isReadonly &&
                indexInfoMayWriteProperty(
                    analysis.checker,
                    indexInfo,
                    propertyName
                )
        );
};

const isReadonlyTargetProperty = (
    analysis: Readonly<ReadonlyTargetAnalysis>,
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- TypeScript escaped property names are branded primitive strings.
    propertyName: ts.__String
): boolean => {
    const cachedResult = analysis.readonlyPropertyCache.get(propertyName);
    if (isDefined(cachedResult)) {
        return cachedResult;
    }

    const isReadonly = tsutils
        .unionTypeParts(analysis.type)
        .some((targetPart) =>
            targetPartHasReadonlyProperty(analysis, targetPart, propertyName)
        );

    analysis.readonlyPropertyCache.set(propertyName, isReadonly);

    return isReadonly;
};

const targetHasReadonlyKey = (
    analysis: Readonly<ReadonlyTargetAnalysis>
): boolean =>
    analysis.propertyNames.some((propertyName) =>
        isReadonlyTargetProperty(analysis, propertyName)
    ) || analysis.readonlyIndexInfos.length > 0;

const sourceIndexMayWriteReadonlyTargetKey = (
    analysis: Readonly<ReadonlyTargetAnalysis>,
    sourceIndexInfo: Readonly<ts.IndexInfo>
): boolean => {
    for (const propertyName of analysis.propertyNames) {
        if (
            isReadonlyTargetProperty(analysis, propertyName) &&
            indexInfoMayWriteProperty(
                analysis.checker,
                sourceIndexInfo,
                propertyName
            )
        ) {
            return true;
        }
    }

    return analysis.readonlyIndexInfos.some((targetIndexInfo) =>
        indexKeyTypesMayOverlap(
            analysis.checker,
            sourceIndexInfo.keyType,
            targetIndexInfo.keyType
        )
    );
};

const sourcePartMayWriteReadonlyTargetKey = (
    analysis: Readonly<ReadonlyTargetAnalysis>,
    sourcePart: Readonly<ts.Type>
): boolean => {
    for (const sourceProperty of analysis.checker.getPropertiesOfType(
        sourcePart
    )) {
        if (
            isReadonlyTargetProperty(analysis, sourceProperty.getEscapedName())
        ) {
            return true;
        }
    }

    return analysis.checker
        .getIndexInfosOfType(sourcePart)
        .some((sourceIndexInfo) =>
            sourceIndexMayWriteReadonlyTargetKey(analysis, sourceIndexInfo)
        );
};

const sourceMayWriteReadonlyTargetKey = (
    analysis: Readonly<ReadonlyTargetAnalysis>,
    parserServices: Readonly<ParserServicesWithTypeInformation>,
    source: Readonly<es.CallExpressionArgument>
): boolean => {
    const sourceType = getConstrainedTypeAtLocation(parserServices, source);

    if (isTypeFlagSet(sourceType, ts.TypeFlags.Any)) {
        return targetHasReadonlyKey(analysis);
    }

    return tsutils
        .unionTypeParts(sourceType)
        .some((sourcePart) =>
            sourcePartMayWriteReadonlyTargetKey(analysis, sourcePart)
        );
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
                    const targetAnalysis = createReadonlyTargetAnalysis(
                        checker,
                        targetType
                    );

                    if (
                        sources.every(
                            (source) =>
                                !sourceMayWriteReadonlyTargetKey(
                                    targetAnalysis,
                                    parserServices,
                                    source
                                )
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
