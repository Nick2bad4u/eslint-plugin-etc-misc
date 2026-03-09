import * as tsutils from "tsutils";
import ts from "typescript";

const hasTypeFlag = (type: Readonly<ts.Type>, flag: ts.TypeFlags): boolean =>
    tsutils.isTypeFlagSet(type, flag);

const hasSymbolFlag = (
    symbol: Readonly<ts.Symbol> | undefined,
    flag: ts.SymbolFlags
): boolean => symbol !== undefined && tsutils.isSymbolFlagSet(symbol, flag);

const getTypeVariants = (type: Readonly<ts.Type>): readonly ts.Type[] =>
    tsutils.unionTypeParts(type);

const isUndefinedVariant = (variant: Readonly<ts.Type>): boolean =>
    hasTypeFlag(variant, ts.TypeFlags.Undefined);

const isEnumSymbol = (symbol: Readonly<ts.Symbol> | undefined): boolean =>
    hasSymbolFlag(symbol, ts.SymbolFlags.Enum) ||
    hasSymbolFlag(symbol, ts.SymbolFlags.EnumMember);

const getVariantTypeNames = (
    typeChecker: Readonly<ts.TypeChecker>,
    variant: Readonly<ts.Type>
): readonly string[] => {
    const apparentVariant = typeChecker.getApparentType(variant);

    const nameCandidates = [
        apparentVariant.getSymbol()?.getName(),
        variant.getSymbol()?.getName(),
        typeChecker.typeToString(apparentVariant),
        typeChecker.typeToString(variant),
    ];

    const names: string[] = [];
    for (const candidateName of nameCandidates) {
        if (typeof candidateName === "string" && candidateName.length > 0) {
            names.push(candidateName);
        }
    }

    return [...new Set(names)];
};

/**
 * Returns normalized textual name variants for all union parts of a type.
 */
export const getTypeNameVariants = (
    typeChecker: Readonly<ts.TypeChecker>,
    type: Readonly<ts.Type>
): readonly string[] => {
    const typeNames = new Set<string>();

    for (const typeVariant of getTypeVariants(type)) {
        for (const typeName of getVariantTypeNames(typeChecker, typeVariant)) {
            typeNames.add(typeName);
        }
    }

    return [...typeNames];
};

const isArrayVariant = (
    typeChecker: Readonly<ts.TypeChecker>,
    variant: Readonly<ts.Type>
): boolean => {
    const apparentVariant = typeChecker.getApparentType(variant);

    if (
        typeChecker.isArrayType(apparentVariant) ||
        typeChecker.isTupleType(apparentVariant)
    ) {
        return true;
    }

    return getVariantTypeNames(typeChecker, apparentVariant).some(
        (name) =>
            name === "ReadonlyArray" ||
            name.startsWith("ReadonlyArray<") ||
            name.startsWith("[")
    );
};

/**
 * Determines whether any union part of the given type is an array/tuple-like
 * collection.
 */
export const isArrayLikeType = (
    typeChecker: Readonly<ts.TypeChecker>,
    type: Readonly<ts.Type>
): boolean =>
    getTypeVariants(type).some((variant) =>
        isArrayVariant(typeChecker, variant)
    );

const matchesConfiguredTypeName = (
    typeChecker: Readonly<ts.TypeChecker>,
    variant: Readonly<ts.Type>,
    configuredType: string
): boolean => {
    if (configuredType === "Array") {
        return isArrayVariant(typeChecker, variant);
    }

    return getVariantTypeNames(typeChecker, variant).some(
        (name) =>
            name === configuredType || name.startsWith(`${configuredType}<`)
    );
};

/**
 * Determines whether the provided type includes any configured collection name
 * across its union parts.
 */
export const includesConfiguredTypeName = (
    typeChecker: Readonly<ts.TypeChecker>,
    type: Readonly<ts.Type>,
    configuredTypes: readonly string[]
): boolean =>
    getTypeVariants(type).some((variant) =>
        configuredTypes.some((configuredType) =>
            matchesConfiguredTypeName(typeChecker, variant, configuredType)
        )
    );

const isEnumLikeVariant = (
    typeChecker: Readonly<ts.TypeChecker>,
    variant: Readonly<ts.Type>
): boolean => {
    const apparentVariant = typeChecker.getApparentType(variant);

    return (
        hasTypeFlag(apparentVariant, ts.TypeFlags.EnumLike) ||
        hasTypeFlag(variant, ts.TypeFlags.EnumLike) ||
        isEnumSymbol(apparentVariant.getSymbol()) ||
        isEnumSymbol(variant.getSymbol())
    );
};

/**
 * Determines whether a type resolves to enum-like members optionally unioned
 * with `undefined`.
 */
export const isEnumLikeOrUndefinedType = (
    typeChecker: Readonly<ts.TypeChecker>,
    type: Readonly<ts.Type>
): boolean => {
    const variants = getTypeVariants(type);
    let hasEnumLike = false;

    for (const variant of variants) {
        if (isEnumLikeVariant(typeChecker, variant)) {
            hasEnumLike = true;
            continue;
        }

        if (isUndefinedVariant(variant)) {
            continue;
        }

        return false;
    }

    return hasEnumLike;
};

/**
 * Determines whether a type is `never`.
 */
export const isNeverType = (type: Readonly<ts.Type>): boolean =>
    hasTypeFlag(type, ts.TypeFlags.Never);
