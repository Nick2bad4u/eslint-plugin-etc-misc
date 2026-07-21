import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";
import type { ArrayValues } from "type-fest";

import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import { arrayFirst, isDefined, safeCastTo, setHas } from "ts-extras";

import { ruleCreator } from "../_internal/rule-creator.js";

type MemberKind =
    | "accessor"
    | "data"
    | "method";
type MessageIds = "forbidden";

const nativeGlobalNames = [
    "AggregateError",
    "Array",
    "ArrayBuffer",
    "Atomics",
    "BigInt",
    "BigInt64Array",
    "BigUint64Array",
    "Boolean",
    "DataView",
    "Date",
    "Error",
    "EvalError",
    "FinalizationRegistry",
    "Float16Array",
    "Float32Array",
    "Float64Array",
    "Function",
    "Int8Array",
    "Int16Array",
    "Int32Array",
    "Intl",
    "JSON",
    "Map",
    "Math",
    "Number",
    "Object",
    "Promise",
    "Proxy",
    "RangeError",
    "ReferenceError",
    "Reflect",
    "RegExp",
    "Set",
    "SharedArrayBuffer",
    "String",
    "Symbol",
    "SyntaxError",
    "TypeError",
    "Uint8Array",
    "Uint8ClampedArray",
    "Uint16Array",
    "Uint32Array",
    "URIError",
    "WeakMap",
    "WeakRef",
    "WeakSet",
] as const;

type NativeAccess = Readonly<{
    readonly name: NativeTypeName;
    readonly side: NativeValueSide;
}>;
type NativeTypeName = ArrayValues<typeof nativeGlobalNames>;
type NativeValueSide = "instance" | "static";
type Options = readonly [];

const nativeTypeNames: ReadonlySet<NativeTypeName> = new Set(nativeGlobalNames);

const callableNativeResults: Readonly<
    Partial<Record<NativeTypeName, NativeTypeName>>
> = {
    AggregateError: "AggregateError",
    Array: "Array",
    BigInt: "BigInt",
    Boolean: "Boolean",
    Date: "String",
    Error: "Error",
    EvalError: "EvalError",
    Function: "Function",
    Number: "Number",
    Object: "Object",
    RangeError: "RangeError",
    ReferenceError: "ReferenceError",
    RegExp: "RegExp",
    String: "String",
    Symbol: "Symbol",
    SyntaxError: "SyntaxError",
    TypeError: "TypeError",
    URIError: "URIError",
};

const instanceDataProperties: Readonly<
    Partial<Record<NativeTypeName, readonly string[]>>
> = {
    Array: ["length"],
    ArrayBuffer: [
        "byteLength",
        "detached",
        "maxByteLength",
        "resizable",
    ],
    DataView: [
        "buffer",
        "byteLength",
        "byteOffset",
    ],
    Error: [
        "cause",
        "message",
        "name",
        "stack",
    ],
    RegExp: ["lastIndex"],
    SharedArrayBuffer: [
        "byteLength",
        "growable",
        "maxByteLength",
    ],
    String: ["length"],
};

const typedArrayNames: ReadonlySet<NativeTypeName> = new Set([
    "BigInt64Array",
    "BigUint64Array",
    "Float16Array",
    "Float32Array",
    "Float64Array",
    "Int8Array",
    "Int16Array",
    "Int32Array",
    "Uint8Array",
    "Uint8ClampedArray",
    "Uint16Array",
    "Uint32Array",
]);

const isNativeTypeName = (name: string): name is NativeTypeName =>
    setHas(nativeTypeNames, name);

const isTypedArrayName = (name: NativeTypeName): boolean =>
    setHas(typedArrayNames, name);

const getMemberKind = (
    descriptor: Readonly<PropertyDescriptor>
): MemberKind => {
    if (typeof descriptor.value === "function") {
        return "method";
    }

    return isDefined(descriptor.get) || isDefined(descriptor.set)
        ? "accessor"
        : "data";
};

const collectPropertyKinds = (
    initialValue: unknown
): ReadonlyMap<string, MemberKind> => {
    const propertyKinds = new Map<string, MemberKind>();
    let value = initialValue;

    while (
        typeof value === "function" ||
        (value !== null && typeof value === "object")
    ) {
        for (const propertyKey of Reflect.ownKeys(value)) {
            if (
                typeof propertyKey !== "string" ||
                propertyKinds.has(propertyKey)
            ) {
                continue;
            }

            const descriptor = Reflect.getOwnPropertyDescriptor(
                value,
                propertyKey
            );
            if (isDefined(descriptor)) {
                propertyKinds.set(propertyKey, getMemberKind(descriptor));
            }
        }

        value = Reflect.getPrototypeOf(value);
    }

    return propertyKinds;
};

const addDataProperties = (
    propertyKinds: Map<string, MemberKind>,
    propertyNames: readonly string[]
): void => {
    for (const propertyName of propertyNames) {
        if (!propertyKinds.has(propertyName)) {
            propertyKinds.set(propertyName, "data");
        }
    }
};

const buildPropertyKinds = (): ReadonlyMap<
    string,
    ReadonlyMap<string, MemberKind>
> => {
    const result = new Map<string, ReadonlyMap<string, MemberKind>>();

    for (const nativeTypeName of nativeGlobalNames) {
        const globalValue = safeCastTo<unknown>(
            Reflect.get(globalThis, nativeTypeName)
        );
        if (!isDefined(globalValue)) {
            continue;
        }

        result.set(
            `${nativeTypeName}:static`,
            collectPropertyKinds(globalValue)
        );

        if (typeof globalValue === "function") {
            const prototypeValue = safeCastTo<unknown>(
                Reflect.get(globalValue, "prototype")
            );
            const instanceKinds = new Map(collectPropertyKinds(prototypeValue));
            const dataProperties = instanceDataProperties[nativeTypeName] ?? [];

            addDataProperties(instanceKinds, dataProperties);

            if (setHas(typedArrayNames, nativeTypeName)) {
                addDataProperties(instanceKinds, [
                    "buffer",
                    "byteLength",
                    "byteOffset",
                    "length",
                ]);
            }

            result.set(`${nativeTypeName}:instance`, instanceKinds);
        }
    }

    return result;
};

const propertyKindsByAccess = buildPropertyKinds();

const isUnshadowedNativeIdentifier = (
    context: Readonly<TSESLint.RuleContext<MessageIds, Options>>,
    identifier: Readonly<es.Identifier>
): identifier is es.Identifier & Readonly<{ name: NativeTypeName }> => {
    if (!isNativeTypeName(identifier.name)) {
        return false;
    }

    let scope: null | TSESLint.Scope.Scope =
        context.sourceCode.getScope(identifier);

    while (scope !== null) {
        const variable = scope.set.get(identifier.name);
        if (isDefined(variable)) {
            return variable.defs.length === 0;
        }

        scope = scope.upper;
    }

    return true;
};

const unwrapExpression = (
    expression: Readonly<es.Expression>
): Readonly<es.Expression> => {
    if (
        expression.type === AST_NODE_TYPES.ChainExpression ||
        expression.type === AST_NODE_TYPES.TSAsExpression ||
        expression.type === AST_NODE_TYPES.TSInstantiationExpression ||
        expression.type === AST_NODE_TYPES.TSNonNullExpression ||
        expression.type === AST_NODE_TYPES.TSSatisfiesExpression ||
        expression.type === AST_NODE_TYPES.TSTypeAssertion
    ) {
        return unwrapExpression(expression.expression);
    }

    return expression;
};

const getStaticPropertyName = (
    memberExpression: Readonly<es.MemberExpression>
): null | string => {
    const { computed, property } = memberExpression;

    if (!computed && property.type === AST_NODE_TYPES.Identifier) {
        return property.name;
    }

    if (computed && property.type === AST_NODE_TYPES.Literal) {
        return typeof property.value === "string" ||
            typeof property.value === "number"
            ? String(property.value)
            : null;
    }

    if (
        computed &&
        property.type === AST_NODE_TYPES.TemplateLiteral &&
        property.expressions.length === 0
    ) {
        return arrayFirst(property.quasis)?.value.cooked ?? null;
    }

    return null;
};

const getObjectPropertyName = (
    property: Readonly<es.Property>
): null | string => {
    if (!property.computed && property.key.type === AST_NODE_TYPES.Identifier) {
        return property.key.name;
    }

    if (property.key.type === AST_NODE_TYPES.Literal) {
        return typeof property.key.value === "string" ||
            typeof property.key.value === "number"
            ? String(property.key.value)
            : null;
    }

    return null;
};

const objectExpressionMayOwnProperty = (
    objectExpression: Readonly<es.ObjectExpression>,
    propertyName: string
): boolean =>
    objectExpression.properties.some(
        (property) =>
            property.type === AST_NODE_TYPES.SpreadElement ||
            getObjectPropertyName(property) === propertyName
    );

const inferLiteralType = (
    literal: Readonly<es.Literal>
): NativeTypeName | null => {
    if (literal.value instanceof RegExp) {
        return "RegExp";
    }

    if (typeof literal.value === "bigint") {
        return "BigInt";
    }

    if (typeof literal.value === "boolean") {
        return "Boolean";
    }

    if (typeof literal.value === "number") {
        return "Number";
    }

    return typeof literal.value === "string" ? "String" : null;
};

const toInstanceAccess = (name: NativeTypeName): NativeAccess => ({
    name,
    side: "instance",
});

const booleanResultBinaryOperators: ReadonlySet<
    Exclude<es.BinaryExpression["operator"], "in">
> = new Set([
    "!=",
    "!==",
    "<",
    "<=",
    "==",
    "===",
    ">",
    ">=",
    "instanceof",
]);

/* eslint-disable @typescript-eslint/no-use-before-define -- Binary and general expression inference are intentionally mutually recursive. */
const inferBinaryType = (
    context: Readonly<TSESLint.RuleContext<MessageIds, Options>>,
    expression: Readonly<es.BinaryExpression>
): NativeAccess | null => {
    if (expression.operator === "in") {
        return toInstanceAccess("Boolean");
    }

    if (setHas(booleanResultBinaryOperators, expression.operator)) {
        return toInstanceAccess("Boolean");
    }

    const left = inferNativeAccess(context, expression.left);
    const right = inferNativeAccess(context, expression.right);
    if (left === null || right === null) {
        return null;
    }

    if (expression.operator === "+") {
        const stringCoercingTypes: ReadonlySet<NativeTypeName> = new Set([
            "Array",
            "Object",
            "RegExp",
            "String",
        ]);
        if (
            setHas(stringCoercingTypes, left.name) ||
            setHas(stringCoercingTypes, right.name)
        ) {
            return toInstanceAccess("String");
        }
    }

    if (
        left.name === "BigInt" &&
        right.name === "BigInt" &&
        expression.operator !== ">>>"
    ) {
        return toInstanceAccess("BigInt");
    }

    const numericInputTypes: ReadonlySet<NativeTypeName> = new Set([
        "Boolean",
        "Number",
    ]);
    return setHas(numericInputTypes, left.name) &&
        setHas(numericInputTypes, right.name)
        ? toInstanceAccess("Number")
        : null;
};

const inferObjectConstructorResult = (
    context: Readonly<TSESLint.RuleContext<MessageIds, Options>>,
    arguments_: readonly Readonly<es.CallExpressionArgument>[]
): NativeAccess | null => {
    const firstArgument = arrayFirst(arguments_);
    if (!isDefined(firstArgument)) {
        return toInstanceAccess("Object");
    }

    if (firstArgument.type === AST_NODE_TYPES.SpreadElement) {
        return null;
    }

    const unwrappedArgument = unwrapExpression(firstArgument);
    if (
        unwrappedArgument.type === AST_NODE_TYPES.Literal &&
        unwrappedArgument.value === null
    ) {
        return toInstanceAccess("Object");
    }

    // Object(value) returns object values unchanged, so their own properties
    // cannot be validated from Object.prototype alone.
    if (unwrappedArgument.type === AST_NODE_TYPES.ObjectExpression) {
        return null;
    }

    return inferNativeAccess(context, unwrappedArgument);
};

const inferIdentifierAccess = (
    context: Readonly<TSESLint.RuleContext<MessageIds, Options>>,
    identifier: Readonly<es.Identifier>
): NativeAccess | null =>
    isUnshadowedNativeIdentifier(context, identifier)
        ? { name: identifier.name, side: "static" }
        : null;

const inferPrototypeAccess = (
    context: Readonly<TSESLint.RuleContext<MessageIds, Options>>,
    expression: Readonly<es.MemberExpression>
): NativeAccess | null => {
    const propertyName = getStaticPropertyName(expression);
    if (
        propertyName !== "prototype" ||
        expression.object.type !== AST_NODE_TYPES.Identifier ||
        !isUnshadowedNativeIdentifier(context, expression.object)
    ) {
        return null;
    }

    return toInstanceAccess(expression.object.name);
};

const inferConstructedAccess = (
    context: Readonly<TSESLint.RuleContext<MessageIds, Options>>,
    expression: Readonly<es.NewExpression>
): NativeAccess | null => {
    if (
        expression.callee.type !== AST_NODE_TYPES.Identifier ||
        !isUnshadowedNativeIdentifier(context, expression.callee) ||
        expression.callee.name === "Proxy"
    ) {
        return null;
    }

    return expression.callee.name === "Object"
        ? inferObjectConstructorResult(context, expression.arguments)
        : toInstanceAccess(expression.callee.name);
};

const inferCalledAccess = (
    context: Readonly<TSESLint.RuleContext<MessageIds, Options>>,
    expression: Readonly<es.CallExpression>
): NativeAccess | null => {
    if (
        expression.callee.type !== AST_NODE_TYPES.Identifier ||
        !isUnshadowedNativeIdentifier(context, expression.callee)
    ) {
        return null;
    }

    if (expression.callee.name === "Object") {
        return inferObjectConstructorResult(context, expression.arguments);
    }

    const resultName = callableNativeResults[expression.callee.name];
    return isDefined(resultName) ? toInstanceAccess(resultName) : null;
};

const inferDirectAccess = (
    expression: Readonly<es.Expression>
):
    | NativeAccess
    | null
    | undefined => {
    if (expression.type === AST_NODE_TYPES.ArrayExpression) {
        return toInstanceAccess("Array");
    }

    if (expression.type === AST_NODE_TYPES.ObjectExpression) {
        return toInstanceAccess("Object");
    }

    if (expression.type === AST_NODE_TYPES.TemplateLiteral) {
        return toInstanceAccess("String");
    }

    if (
        expression.type === AST_NODE_TYPES.ArrowFunctionExpression ||
        expression.type === AST_NODE_TYPES.FunctionExpression
    ) {
        return toInstanceAccess("Function");
    }

    if (expression.type === AST_NODE_TYPES.Literal) {
        const nativeType = inferLiteralType(expression);
        return nativeType === null ? null : toInstanceAccess(nativeType);
    }

    return undefined;
};

const inferNativeAccess = (
    context: Readonly<TSESLint.RuleContext<MessageIds, Options>>,
    rawExpression: Readonly<es.Expression>
): NativeAccess | null => {
    const expression = unwrapExpression(rawExpression);
    const directAccess = inferDirectAccess(expression);
    if (isDefined(directAccess)) {
        return directAccess;
    }

    if (expression.type === AST_NODE_TYPES.Identifier) {
        return inferIdentifierAccess(context, expression);
    }

    if (expression.type === AST_NODE_TYPES.BinaryExpression) {
        return inferBinaryType(context, expression);
    }

    if (expression.type === AST_NODE_TYPES.MemberExpression) {
        return inferPrototypeAccess(context, expression);
    }

    if (expression.type === AST_NODE_TYPES.NewExpression) {
        return inferConstructedAccess(context, expression);
    }

    return expression.type === AST_NODE_TYPES.CallExpression
        ? inferCalledAccess(context, expression)
        : null;
};
/* eslint-enable @typescript-eslint/no-use-before-define -- End mutually recursive expression inference. */

const isIndexProperty = (
    access: Readonly<NativeAccess>,
    name: string
): boolean =>
    access.side === "instance" &&
    /^(?:0|[1-9]\d*)$/v.test(name) &&
    (access.name === "Array" ||
        access.name === "String" ||
        isTypedArrayName(access.name));

const isCallUsage = (
    memberExpression: Readonly<es.MemberExpression>
): boolean =>
    memberExpression.parent.type === AST_NODE_TYPES.CallExpression &&
    memberExpression.parent.callee === memberExpression;

/**
 * Disallow consuming non-native members on statically recognizable built-ins.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => ({
        MemberExpression: (
            memberExpression: Readonly<es.MemberExpression>
        ): void => {
            const propertyName = getStaticPropertyName(memberExpression);
            if (propertyName === null) {
                return;
            }

            const unwrappedObject = unwrapExpression(memberExpression.object);
            if (
                unwrappedObject.type === AST_NODE_TYPES.ObjectExpression &&
                objectExpressionMayOwnProperty(unwrappedObject, propertyName)
            ) {
                return;
            }

            if (
                propertyName === "prototype" &&
                unwrappedObject.type === AST_NODE_TYPES.FunctionExpression
            ) {
                return;
            }

            const nativeAccess = inferNativeAccess(
                context,
                memberExpression.object
            );
            if (
                nativeAccess === null ||
                isIndexProperty(nativeAccess, propertyName)
            ) {
                return;
            }

            const propertyKinds = propertyKindsByAccess.get(
                `${nativeAccess.name}:${nativeAccess.side}`
            );
            if (!isDefined(propertyKinds)) {
                return;
            }

            const memberKind = propertyKinds.get(propertyName);
            if (
                !isDefined(memberKind) ||
                (memberKind !== "method" && isCallUsage(memberExpression))
            ) {
                context.report({
                    data: {
                        nativeTypeName: nativeAccess.name,
                        propertyName,
                    },
                    messageId: "forbidden",
                    node: memberExpression,
                });
            }
        },
    }),
    meta: {
        deprecated: false,
        docs: {
            deprecated: false,
            description:
                "disallow usage of non-native members on built-in JavaScript objects.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-use-extend-native",
        },
        hasSuggestions: false,
        languages: ["js/js"],
        messages: {
            forbidden:
                "Avoid using '{{nativeTypeName}}.{{propertyName}}' when it is not part of the native JavaScript API.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-use-extend-native",
});

export default rule;
