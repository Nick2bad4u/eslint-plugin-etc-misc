/* eslint-disable @typescript-eslint/no-use-before-define, perfectionist/sort-modules -- helper declarations are grouped by concern; forward references are functionally harmless and keep inference code readable. */

import type { TSESTree as es } from "@typescript-eslint/utils";

import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import { isDefined, setHas } from "ts-extras";

import { ruleCreator } from "../_internal/rule-creator.js";

type MemberKind = "accessor" | "data" | "method";

type MessageIds = "forbidden";

type NativeTypeInfo = Readonly<{
    readonly propertyKinds: ReadonlyMap<string, MemberKind>;
}>;

type NativeTypeDefinition = Readonly<{
    readonly constructorRef?: object;
    readonly dataProperties?: readonly string[];
    readonly name: NativeTypeName;
    readonly prototypeRef?: object;
}>;

type NativeTypeName =
    | "Array"
    | "BigInt"
    | "Boolean"
    | "Date"
    | "Error"
    | "Function"
    | "Map"
    | "Number"
    | "Object"
    | "Promise"
    | "RegExp"
    | "Set"
    | "String"
    | "Symbol"
    | "WeakMap"
    | "WeakSet";

type Options = readonly [];

const nativeTypeDefinitions: readonly NativeTypeDefinition[] = [
    {
        constructorRef: Array,
        dataProperties: ["length"],
        name: "Array",
        prototypeRef: Array.prototype,
    },
    {
        constructorRef: BigInt,
        name: "BigInt",
        prototypeRef: BigInt.prototype,
    },
    {
        constructorRef: Boolean,
        name: "Boolean",
        prototypeRef: Boolean.prototype,
    },
    {
        constructorRef: Date,
        name: "Date",
        prototypeRef: Date.prototype,
    },
    {
        constructorRef: Error,
        name: "Error",
        prototypeRef: Error.prototype,
    },
    {
        constructorRef: Function,
        name: "Function",
        prototypeRef: Function.prototype,
    },
    {
        constructorRef: Map,
        name: "Map",
        prototypeRef: Map.prototype,
    },
    {
        constructorRef: Number,
        name: "Number",
        prototypeRef: Number.prototype,
    },
    {
        constructorRef: Object,
        name: "Object",
        prototypeRef: Object.prototype,
    },
    {
        constructorRef: Promise,
        name: "Promise",
        prototypeRef: Promise.prototype,
    },
    {
        constructorRef: RegExp,
        dataProperties: ["lastIndex"],
        name: "RegExp",
        prototypeRef: RegExp.prototype,
    },
    {
        constructorRef: Set,
        name: "Set",
        prototypeRef: Set.prototype,
    },
    {
        constructorRef: String,
        dataProperties: ["length"],
        name: "String",
        prototypeRef: String.prototype,
    },
    {
        constructorRef: Symbol,
        name: "Symbol",
        prototypeRef: Symbol.prototype,
    },
    {
        constructorRef: WeakMap,
        name: "WeakMap",
        prototypeRef: WeakMap.prototype,
    },
    {
        constructorRef: WeakSet,
        name: "WeakSet",
        prototypeRef: WeakSet.prototype,
    },
];

const nativeTypeNameSet = new Set<NativeTypeName>(
    nativeTypeDefinitions.map((definition) => definition.name)
);
const nativeTypeNameLookup: ReadonlySet<string> = nativeTypeNameSet;

function buildNativeTypeInfoByName(
    definitions: readonly NativeTypeDefinition[]
): ReadonlyMap<NativeTypeName, NativeTypeInfo> {
    return new Map(
        definitions.map((definition) => [
            definition.name,
            {
                propertyKinds: collectPropertyKinds(definition),
            },
        ])
    );
}

function collectPropertyKinds(
    definition: Readonly<NativeTypeDefinition>
): ReadonlyMap<string, MemberKind> {
    const propertyKinds = new Map<string, MemberKind>();
    const descriptorSources = [
        definition.constructorRef,
        definition.prototypeRef,
    ] as const;

    for (const descriptorSource of descriptorSources) {
        if (!isDefined(descriptorSource)) {
            continue;
        }

        const ownPropertyNames = Object.getOwnPropertyNames(descriptorSource);

        for (const propertyName of ownPropertyNames) {
            if (propertyKinds.has(propertyName)) {
                continue;
            }

            const descriptor = Object.getOwnPropertyDescriptor(
                descriptorSource,
                propertyName
            );

            if (!isDefined(descriptor)) {
                continue;
            }

            propertyKinds.set(propertyName, getMemberKind(descriptor));
        }
    }

    for (const dataPropertyName of definition.dataProperties ?? []) {
        if (!propertyKinds.has(dataPropertyName)) {
            propertyKinds.set(dataPropertyName, "data");
        }
    }

    return propertyKinds;
}

function unwrapExpression(
    node: Readonly<es.Expression>
): Readonly<es.Expression> {
    if (
        node.type === AST_NODE_TYPES.TSAsExpression ||
        node.type === AST_NODE_TYPES.TSTypeAssertion
    ) {
        return unwrapExpression(node.expression);
    }

    if (node.type === AST_NODE_TYPES.ChainExpression) {
        return unwrapExpression(node.expression);
    }

    return node;
}

const inferNativeType = (
    rawExpression: Readonly<es.Expression>
): NativeTypeName | null => {
    const expression = unwrapExpression(rawExpression);

    if (expression.type === AST_NODE_TYPES.ArrayExpression) {
        return "Array";
    }

    if (expression.type === AST_NODE_TYPES.ObjectExpression) {
        return "Object";
    }

    if (expression.type === AST_NODE_TYPES.TemplateLiteral) {
        return "String";
    }

    if (expression.type === AST_NODE_TYPES.Literal) {
        return inferNativeTypeFromLiteral(expression);
    }

    if (
        expression.type === AST_NODE_TYPES.Identifier &&
        isNativeTypeName(expression.name)
    ) {
        return expression.name;
    }

    if (expression.type === AST_NODE_TYPES.BinaryExpression) {
        return inferNativeTypeFromBinaryExpression(expression);
    }

    if (expression.type === AST_NODE_TYPES.MemberExpression) {
        return inferNativeTypeFromMemberExpression(expression);
    }

    if (expression.type === AST_NODE_TYPES.NewExpression) {
        return inferNativeTypeFromNewExpression(expression);
    }

    return null;
};

function inferNativeTypeFromBinaryExpression(
    expression: Readonly<es.BinaryExpression>
): NativeTypeName | null {
    if (expression.operator !== "+") {
        return null;
    }

    const leftType = inferNativeType(expression.left);
    const rightType = inferNativeType(expression.right);

    if (leftType === "String" || rightType === "String") {
        return "String";
    }

    if (leftType === "RegExp" && rightType === "RegExp") {
        return "String";
    }

    return null;
}

function inferNativeTypeFromLiteral(
    expression: Readonly<es.Literal>
): NativeTypeName | null {
    if (typeof expression.value === "string") {
        return "String";
    }

    if (typeof expression.value === "number") {
        return "Number";
    }

    if (typeof expression.value === "boolean") {
        return "Boolean";
    }

    if (typeof expression.value === "bigint") {
        return "BigInt";
    }

    if (expression.value instanceof RegExp) {
        return "RegExp";
    }

    return null;
}

function inferNativeTypeFromMemberExpression(
    expression: Readonly<es.MemberExpression>
): NativeTypeName | null {
    if (
        expression.computed ||
        expression.property.type !== AST_NODE_TYPES.Identifier ||
        expression.property.name !== "prototype" ||
        expression.object.type !== AST_NODE_TYPES.Identifier ||
        !isNativeTypeName(expression.object.name)
    ) {
        return null;
    }

    return expression.object.name;
}

function inferNativeTypeFromNewExpression(
    expression: Readonly<es.NewExpression>
): NativeTypeName | null {
    if (
        expression.callee.type !== AST_NODE_TYPES.Identifier ||
        !isNativeTypeName(expression.callee.name)
    ) {
        return null;
    }

    return expression.callee.name;
}

function getMemberKind(descriptor: Readonly<PropertyDescriptor>): MemberKind {
    if (typeof descriptor.value === "function") {
        return "method";
    }

    if (isDefined(descriptor.get) || isDefined(descriptor.set)) {
        return "accessor";
    }

    return "data";
}

const getStaticMemberPropertyName = (
    node: Readonly<es.MemberExpression>
): null | string => {
    if (node.computed || node.property.type !== AST_NODE_TYPES.Identifier) {
        return null;
    }

    return node.property.name;
};

const isCallUsage = (node: Readonly<es.MemberExpression>): boolean => {
    const parent = node.parent;

    return (
        parent.type === AST_NODE_TYPES.CallExpression && parent.callee === node
    );
};

const nativeTypeInfoByName: ReadonlyMap<NativeTypeName, NativeTypeInfo> =
    buildNativeTypeInfoByName(nativeTypeDefinitions);

const isNativeTypeName = (value: string): value is NativeTypeName =>
    setHas(nativeTypeNameLookup, value);

/**
 * Disallow using non-native members on built-in JavaScript types.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => ({
        MemberExpression: (node: Readonly<es.MemberExpression>): void => {
            const propertyName = getStaticMemberPropertyName(node);

            if (propertyName === null || propertyName === "prototype") {
                return;
            }

            const nativeTypeName = inferNativeType(node.object);

            if (nativeTypeName === null) {
                return;
            }

            const nativeTypeInfo = nativeTypeInfoByName.get(nativeTypeName);

            if (!isDefined(nativeTypeInfo)) {
                return;
            }

            const memberKind = nativeTypeInfo.propertyKinds.get(propertyName);

            if (!isDefined(memberKind)) {
                context.report({
                    data: {
                        nativeTypeName,
                        propertyName,
                    },
                    messageId: "forbidden",
                    node,
                });

                return;
            }

            if (isCallUsage(node) && memberKind !== "method") {
                context.report({
                    data: {
                        nativeTypeName,
                        propertyName,
                    },
                    messageId: "forbidden",
                    node,
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

/* eslint-enable @typescript-eslint/no-use-before-define, perfectionist/sort-modules -- Re-enable after this file-scoped exception block. */
