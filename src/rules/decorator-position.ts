import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import { arrayAt, arrayFirst, isDefined } from "ts-extras";

import { ruleCreator } from "../_internal/rule-creator.js";

type Alignment = "above" | "prefer-inline";

type DecoratedMember =
    | es.AccessorProperty
    | es.MethodDefinition
    | es.PropertyDefinition;

type DecoratorMatcher =
    readonly [string, Readonly<{ readonly withArgs: boolean }>] | string;

type MessageIds = "expectedAbove" | "expectedInline";

type NormalizedOptions = Readonly<{
    readonly methods: Alignment;
    readonly overrides: Readonly<{
        readonly above: readonly DecoratorMatcher[];
        readonly "prefer-inline": readonly DecoratorMatcher[];
    }>;
    readonly printWidth: number;
    readonly properties: Alignment;
}>;

type Options = readonly [
    Readonly<{
        readonly methods?: Alignment;
        readonly overrides?: Readonly<{
            readonly above?: readonly DecoratorMatcher[];
            readonly "prefer-inline"?: readonly DecoratorMatcher[];
        }>;
        readonly printWidth?: number;
        readonly properties?: Alignment;
    }>?,
];

const defaultOptions = [
    {
        methods: "above",
        overrides: {
            above: [],
            "prefer-inline": [],
        },
        printWidth: 100,
        properties: "prefer-inline",
    },
] as const satisfies Options;

const getStaticPropertyName = (
    expression: Readonly<es.Expression | es.PrivateIdentifier>
): string | undefined => {
    if (expression.type === AST_NODE_TYPES.Identifier) {
        return expression.name;
    }

    if (
        expression.type === AST_NODE_TYPES.Literal &&
        typeof expression.value === "string"
    ) {
        return expression.value;
    }

    return undefined;
};

const getDecoratorName = (
    expression: Readonly<es.Expression>
): string | undefined => {
    if (expression.type === AST_NODE_TYPES.Identifier) {
        return expression.name;
    }

    if (expression.type === AST_NODE_TYPES.CallExpression) {
        return getDecoratorName(expression.callee);
    }

    if (expression.type === AST_NODE_TYPES.ChainExpression) {
        return getDecoratorName(expression.expression);
    }

    if (expression.type === AST_NODE_TYPES.MemberExpression) {
        const objectName = getDecoratorName(expression.object);
        const propertyName = getStaticPropertyName(expression.property);

        if (isDefined(objectName) && isDefined(propertyName)) {
            return `${objectName}.${propertyName}`;
        }
    }

    return undefined;
};

const normalizeConfiguredName = (name: string): string =>
    name.startsWith("@") ? name.slice(1) : name;

const isCalledDecorator = (decorator: Readonly<es.Decorator>): boolean =>
    decorator.expression.type === AST_NODE_TYPES.CallExpression;

const matcherMatchesDecorator = (
    matcher: DecoratorMatcher,
    decorator: Readonly<es.Decorator>,
    decoratorName: string | undefined
): boolean => {
    const [rawName, matcherOptions] =
        typeof matcher === "string" ? [matcher, undefined] : matcher;

    if (
        decoratorName === undefined ||
        normalizeConfiguredName(rawName) !== decoratorName
    ) {
        return false;
    }

    return (
        !isDefined(matcherOptions) ||
        matcherOptions.withArgs === isCalledDecorator(decorator)
    );
};

const normalizeOptions = (rawOptions: Options[0]): NormalizedOptions => ({
    methods: rawOptions?.methods ?? arrayFirst(defaultOptions).methods,
    overrides: {
        above: rawOptions?.overrides?.above ?? [],
        "prefer-inline": rawOptions?.overrides?.["prefer-inline"] ?? [],
    },
    printWidth: rawOptions?.printWidth ?? arrayFirst(defaultOptions).printWidth,
    properties: rawOptions?.properties ?? arrayFirst(defaultOptions).properties,
});

const getConfiguredAlignment = (
    decorator: Readonly<es.Decorator>,
    decoratorName: string | undefined,
    options: Readonly<NormalizedOptions>
): Alignment | undefined => {
    // A decorator listed in both groups is ambiguous. Prefer the safer,
    // vertically expanded representation deterministically.
    if (
        options.overrides.above.some((matcher) =>
            matcherMatchesDecorator(matcher, decorator, decoratorName)
        )
    ) {
        return "above";
    }

    if (
        options.overrides["prefer-inline"].some((matcher) =>
            matcherMatchesDecorator(matcher, decorator, decoratorName)
        )
    ) {
        return "prefer-inline";
    }

    return undefined;
};

const getHeaderEnd = (member: Readonly<DecoratedMember>): number => {
    if (
        member.type === AST_NODE_TYPES.MethodDefinition &&
        member.value.body !== null
    ) {
        return arrayFirst(member.value.body.range);
    }

    return member.range[1];
};

const getProjectedInlineLength = (
    sourceCode: Readonly<TSESLint.SourceCode>,
    decorator: Readonly<es.Decorator>,
    member: Readonly<DecoratedMember>
): number => {
    const headerText = sourceCode.text
        .slice(arrayFirst(decorator.range), getHeaderEnd(member))
        .replaceAll(/\s+/gv, " ")
        .trim();

    return decorator.loc.start.column + headerText.length;
};

const getLineIndentation = (
    sourceText: string,
    index: number
): string | undefined => {
    const lineStart = sourceText.lastIndexOf("\n", index - 1) + 1;
    const indentation = sourceText.slice(lineStart, index);

    return /^\s*$/v.test(indentation) ? indentation : undefined;
};

const createWhitespaceFix = (
    context: Readonly<TSESLint.RuleContext<MessageIds, Options>>,
    decorator: Readonly<es.Decorator>,
    memberStart: number,
    alignment: Alignment
): ((fixer: TSESLint.RuleFixer) => null | TSESLint.RuleFix) => {
    const whitespaceRange = [decorator.range[1], memberStart] as const;

    return (fixer): null | TSESLint.RuleFix => {
        const whitespace = context.sourceCode.text.slice(...whitespaceRange);

        // Replacing comments or other tokens would be destructive. The report
        // remains useful, but deliberately has no fix in that case.
        if (!/^\s*$/v.test(whitespace)) {
            return null;
        }

        if (alignment === "prefer-inline") {
            return fixer.replaceTextRange(whitespaceRange, " ");
        }

        const indentation = getLineIndentation(
            context.sourceCode.text,
            arrayFirst(decorator.range)
        );

        if (!isDefined(indentation)) {
            return null;
        }

        const newline = context.sourceCode.text.includes("\r\n")
            ? "\r\n"
            : "\n";

        return fixer.replaceTextRange(
            whitespaceRange,
            `${newline}${indentation}`
        );
    };
};

const checkMember = (
    context: Readonly<TSESLint.RuleContext<MessageIds, Options>>,
    member: Readonly<DecoratedMember>,
    options: Readonly<NormalizedOptions>
): void => {
    const decorator = arrayAt(member.decorators, -1);

    if (!isDefined(decorator)) {
        return;
    }

    const decoratorName = getDecoratorName(decorator.expression);
    const firstMemberToken = context.sourceCode.getTokenAfter(decorator);

    if (firstMemberToken === null) {
        return;
    }

    const configuredAlignment = getConfiguredAlignment(
        decorator,
        decoratorName,
        options
    );
    const memberAlignment =
        member.type === AST_NODE_TYPES.MethodDefinition
            ? options.methods
            : options.properties;
    let desiredAlignment = configuredAlignment ?? memberAlignment;

    // A multiline decorator cannot be safely collapsed. Likewise, respect the
    // configured width by expanding an otherwise inline-preferred declaration.
    if (
        desiredAlignment === "prefer-inline" &&
        (decorator.loc.start.line !== decorator.loc.end.line ||
            getProjectedInlineLength(context.sourceCode, decorator, member) >
                options.printWidth)
    ) {
        desiredAlignment = "above";
    }

    const isInline = decorator.loc.end.line === firstMemberToken.loc.start.line;
    const alignmentMatches =
        desiredAlignment === "prefer-inline" ? isInline : !isInline;

    if (alignmentMatches) {
        return;
    }

    const displayName =
        decoratorName ?? context.sourceCode.getText(decorator.expression);

    context.report({
        data: {
            name: displayName,
        },
        fix: createWhitespaceFix(
            context,
            decorator,
            arrayFirst(firstMemberToken.range),
            desiredAlignment
        ),
        messageId:
            desiredAlignment === "prefer-inline"
                ? "expectedInline"
                : "expectedAbove",
        node: decorator,
    });
};

/** Enforce configured class-member decorator placement. */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context, [rawOptions]) => {
        const options = normalizeOptions(rawOptions);

        return {
            AccessorProperty: (node: Readonly<es.AccessorProperty>): void => {
                checkMember(context, node, options);
            },
            MethodDefinition: (node: Readonly<es.MethodDefinition>): void => {
                checkMember(context, node, options);
            },
            PropertyDefinition: (
                node: Readonly<es.PropertyDefinition>
            ): void => {
                checkMember(context, node, options);
            },
        };
    },
    defaultOptions,
    meta: {
        defaultOptions: [
            {
                methods: "above",
                overrides: {
                    above: [],
                    "prefer-inline": [],
                },
                printWidth: 100,
                properties: "prefer-inline",
            },
        ],
        deprecated: false,
        docs: {
            deprecated: false,
            description:
                "enforce consistent placement of decorators on class properties and methods.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/decorator-position",
        },
        fixable: "whitespace",
        hasSuggestions: false,
        languages: ["js/js"],
        messages: {
            expectedAbove:
                "Decorator '@{{name}}' must be placed above the decorated member.",
            expectedInline:
                "Decorator '@{{name}}' must be inline with the decorated member.",
        },
        schema: [
            {
                additionalProperties: false,
                description: "Decorator placement configuration.",
                properties: {
                    methods: {
                        description: "Default placement for method decorators.",
                        enum: ["prefer-inline", "above"],
                        type: "string",
                    },
                    overrides: {
                        additionalProperties: false,
                        description: "Decorator-specific placement overrides.",
                        properties: {
                            above: {
                                description:
                                    "Decorators that must be placed above the member.",
                                items: {
                                    oneOf: [
                                        { type: "string" },
                                        {
                                            additionalItems: false,
                                            items: [
                                                { type: "string" },
                                                {
                                                    additionalProperties: false,
                                                    properties: {
                                                        withArgs: {
                                                            type: "boolean",
                                                        },
                                                    },
                                                    required: ["withArgs"],
                                                    type: "object",
                                                },
                                            ],
                                            maxItems: 2,
                                            minItems: 2,
                                            type: "array",
                                        },
                                    ],
                                },
                                type: "array",
                                uniqueItems: true,
                            },
                            "prefer-inline": {
                                description:
                                    "Decorators that should share a line with the member.",
                                items: {
                                    oneOf: [
                                        { type: "string" },
                                        {
                                            additionalItems: false,
                                            items: [
                                                { type: "string" },
                                                {
                                                    additionalProperties: false,
                                                    properties: {
                                                        withArgs: {
                                                            type: "boolean",
                                                        },
                                                    },
                                                    required: ["withArgs"],
                                                    type: "object",
                                                },
                                            ],
                                            maxItems: 2,
                                            minItems: 2,
                                            type: "array",
                                        },
                                    ],
                                },
                                type: "array",
                                uniqueItems: true,
                            },
                        },
                        type: "object",
                    },
                    printWidth: {
                        description:
                            "Maximum projected line width for inline placement.",
                        minimum: 1,
                        type: "number",
                    },
                    properties: {
                        description:
                            "Default placement for property and auto-accessor decorators.",
                        enum: ["prefer-inline", "above"],
                        type: "string",
                    },
                },
                type: "object",
            },
        ],
        type: "layout",
    },
    name: "decorator-position",
});

export default rule;
