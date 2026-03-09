import type { TSESTree as es } from "@typescript-eslint/utils";

import { dirname, resolve } from "node:path";

import { getImportSourceFromNode } from "../_internal/import-patterns";
import { ruleCreator } from "../_internal/rule-creator";
import {
    createReplacementRuleInfo,
    withDeprecatedRuleLifecycle,
} from "../_internal/rule-deprecation";

type MessageIds = "forbidden";

type Options = readonly [];

const importFileSuffixes = [
    "",
    ".ts",
    ".tsx",
    ".js",
    ".mjs",
    ".cjs",
    ".d.ts",
    "/index.ts",
    "/index.tsx",
    "/index.js",
    "/index.mjs",
    "/index.cjs",
] as const;

const toResolvedCandidates = (
    baseDirectory: string,
    importSource: string
): readonly string[] =>
    importFileSuffixes.map((suffix) =>
        resolve(baseDirectory, `${importSource}${suffix}`)
    );

/**
 * Disallow importing the current file from itself.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => {
        const currentFilePath = context.filename;
        if (currentFilePath === "<input>") {
            return {};
        }

        const normalizedCurrentFilePath = resolve(currentFilePath);
        const currentFileDirectory = dirname(normalizedCurrentFilePath);

        return {
            "ImportDeclaration, ExportNamedDeclaration[source], ExportAllDeclaration, ImportExpression":
                (node: Readonly<es.Node>): void => {
                    const sourceText = getImportSourceFromNode(node);
                    if (sourceText?.startsWith(".") !== true) {
                        return;
                    }

                    const candidatePaths = toResolvedCandidates(
                        currentFileDirectory,
                        sourceText
                    );

                    if (candidatePaths.includes(normalizedCurrentFilePath)) {
                        context.report({
                            messageId: "forbidden",
                            node,
                        });
                    }
                },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description: "disallow importing the current file from itself.",
            recommended: false,
            url: "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/no-self-import.md",
        },
        hasSuggestions: false,
        messages: {
            forbidden: "Do not import the current file from itself.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-self-import",
});

/**
 * Wrapper rule with explicit lifecycle metadata and replacement mapping.
 */
const deprecatedRule: typeof rule = withDeprecatedRuleLifecycle(rule, {
    message: "Deprecated in favor of import/no-self-import.",
    replacedBy: [
        createReplacementRuleInfo({
            plugin: {
                name: "import",
                url: "https://github.com/import-js/eslint-plugin-import",
            },
            rule: {
                name: "no-self-import",
                url: "https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-self-import.md",
            },
        }),
    ],
    ruleId: "no-self-import",
});

export default deprecatedRule;
