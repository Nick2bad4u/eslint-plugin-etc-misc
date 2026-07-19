import type { TSESTree as es } from "@typescript-eslint/utils";

import { ESLintUtils } from "@typescript-eslint/utils";
import { isDefined, isEmpty } from "ts-extras";

import {
    compileIgnorePatterns,
    type IgnoreMode,
    type IgnorePatternBuckets,
} from "../_internal/ignore-patterns.js";
import { ruleCreator } from "../_internal/rule-creator.js";
import {
    getIdentifierSymbol,
    getJsDocTagComments,
    hasAnyPatternMatch,
    isDeclarationIdentifier,
    isImportOrExportSpecifier,
} from "../_internal/symbol-usage.js";

type MessageIds =
    | "forbidden"
    | "forbiddenWithComment"
    | "invalidIgnorePattern";

type Options = readonly [
    {
        readonly ignored?: Readonly<Record<string, IgnoreMode>>;
    }?,
];

const defaultOptions: Options = [{}];

/**
 * Disallow usages of symbols tagged with `@internal`.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => {
        const [{ ignored = {} } = {}] = context.options;
        const parserServices = ESLintUtils.getParserServices(context);
        const typeChecker = parserServices.program.getTypeChecker();
        const compiledIgnorePatterns = compileIgnorePatterns(ignored);
        const ignorePatterns: IgnorePatternBuckets =
            compiledIgnorePatterns.patterns;

        return {
            Identifier: (node: Readonly<es.Identifier>) => {
                if (isImportOrExportSpecifier(node.parent)) {
                    return;
                }

                if (isDeclarationIdentifier(node)) {
                    return;
                }

                const symbol = getIdentifierSymbol(parserServices, node);
                if (!isDefined(symbol)) {
                    return;
                }

                const symbolName = symbol.getName();
                if (hasAnyPatternMatch(symbolName, ignorePatterns.name)) {
                    return;
                }

                const fullyQualifiedName =
                    typeChecker.getFullyQualifiedName(symbol);
                if (
                    hasAnyPatternMatch(fullyQualifiedName, ignorePatterns.path)
                ) {
                    return;
                }

                const internalComments = getJsDocTagComments(
                    symbol,
                    typeChecker,
                    "internal"
                );
                if (isEmpty(internalComments)) {
                    return;
                }

                for (const comment of internalComments) {
                    if (!isDefined(comment)) {
                        context.report({
                            data: { name: symbolName },
                            messageId: "forbidden",
                            node,
                        });
                        continue;
                    }

                    context.report({
                        data: {
                            comment,
                            name: symbolName,
                        },
                        messageId: "forbiddenWithComment",
                        node,
                    });
                }
            },
            Program: (node: Readonly<es.Program>) => {
                for (const invalidPattern of compiledIgnorePatterns.invalidPatterns) {
                    context.report({
                        data: {
                            pattern: invalidPattern,
                        },
                        messageId: "invalidIgnorePattern",
                        node,
                    });
                }
            },
        };
    },
    defaultOptions,
    meta: {
        defaultOptions: [{}],
        deprecated: false,
        docs: {
            deprecated: false,
            description: "disallow usage of APIs tagged with @internal.",
            frozen: false,
            recommended: true,
            requiresTypeChecking: true,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-internal",
        },
        hasSuggestions: false,
        messages: {
            forbidden: '"{{name}}" is internal.',
            forbiddenWithComment: '"{{name}}" is internal: {{comment}}',
            invalidIgnorePattern:
                "Invalid ignored regex pattern '{{pattern}}'. Update this rule option to a valid regular expression.",
        },
        schema: [
            {
                additionalProperties: false,
                description:
                    "Options for ignoring some internal symbols by name or declaration path pattern.",
                properties: {
                    ignored: {
                        additionalProperties: {
                            description:
                                'Match behavior for the pattern key. Use "name" to match symbol names or "path" to match fully-qualified declaration paths.',
                            enum: ["name", "path"],
                            type: "string",
                        },
                        description: "Map of regex patterns to ignore mode.",
                        type: "object",
                    },
                },
                type: "object",
            },
        ],
        type: "problem",
    },
    name: "no-internal",
});

export default rule;
