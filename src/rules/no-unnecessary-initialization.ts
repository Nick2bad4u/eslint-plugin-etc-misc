import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

import { arrayFirst, isDefined } from "ts-extras";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden";

type Options = readonly [];

const disallowedSelector =
    "PropertyDefinition > Identifier.value[name='undefined'], VariableDeclarator > Identifier.init[name='undefined']";

const getUndefinedInitializationRemovalRange = (
    sourceCode: Readonly<TSESLint.SourceCode>,
    node: Readonly<es.Node>
): readonly [number, number] | undefined => {
    const equalsToken = sourceCode.getTokenBefore(node, {
        filter: (token): boolean => token.value === "=",
    });

    if (equalsToken === null) {
        return undefined;
    }

    let fixStartIndex = arrayFirst(equalsToken.range);
    const sourceText = sourceCode.text;

    while (fixStartIndex > 0) {
        const previousCharacter = sourceText.at(fixStartIndex - 1);
        if (previousCharacter !== " " && previousCharacter !== "\t") {
            break;
        }

        fixStartIndex -= 1;
    }

    return [fixStartIndex, node.range[1]];
};

/**
 * Disallow explicit initialization to `undefined`.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => {
        const sourceCode = context.sourceCode;

        return {
            [disallowedSelector]: (node: Readonly<es.Node>): void => {
                const removalRange = getUndefinedInitializationRemovalRange(
                    sourceCode,
                    node
                );

                if (!isDefined(removalRange)) {
                    return;
                }

                const fix: TSESLint.ReportFixFunction = (fixer) =>
                    fixer.removeRange(removalRange);

                context.report({
                    fix,
                    messageId: "forbidden",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        deprecated: false,
        docs: {
            deprecated: false,
            description: "disallow unnecessary initialization to undefined.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-unnecessary-initialization",
        },
        fixable: "code",
        hasSuggestions: false,
        messages: {
            forbidden: "Unnecessary initialization to undefined.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "no-unnecessary-initialization",
});

export default rule;
