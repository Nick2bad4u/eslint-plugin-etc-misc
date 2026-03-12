import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden" | "suggestPreferNamedTupleMembers";

type Options = readonly [];

const isUnnamedTupleElement = (
    tupleElement: Readonly<es.TypeNode>
): boolean => {
    if (tupleElement.type === "TSNamedTupleMember") {
        return false;
    }

    if (
        tupleElement.type === "TSRestType" &&
        tupleElement.typeAnnotation.type === "TSNamedTupleMember"
    ) {
        return false;
    }

    return true;
};

const generateUniqueTupleMemberName = (
    preferredName: string,
    usedNames: Readonly<{
        readonly add: (value: string) => unknown;
        readonly has: (value: string) => boolean;
    }>
): string => {
    if (!usedNames.has(preferredName)) {
        usedNames.add(preferredName);

        return preferredName;
    }

    let suffix = 2;

    while (usedNames.has(`${preferredName}_${suffix}`)) {
        suffix += 1;
    }

    const generatedName = `${preferredName}_${suffix}`;

    usedNames.add(generatedName);

    return generatedName;
};

const getTupleMemberReplacementText = (
    tupleElement: Readonly<es.TypeNode>,
    memberName: string,
    sourceCode: Readonly<TSESLint.SourceCode>
): string => {
    if (tupleElement.type === "TSOptionalType") {
        return `${memberName}?: ${sourceCode.getText(tupleElement.typeAnnotation)}`;
    }

    if (tupleElement.type === "TSRestType") {
        if (tupleElement.typeAnnotation.type === "TSNamedTupleMember") {
            return sourceCode.getText(tupleElement);
        }

        return `...${memberName}: ${sourceCode.getText(tupleElement.typeAnnotation)}`;
    }

    return `${memberName}: ${sourceCode.getText(tupleElement)}`;
};

/**
 * Prefer named tuple members for readability.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => {
        const sourceCode = context.sourceCode;

        return {
            TSTupleType: (node: Readonly<es.TSTupleType>): void => {
                const hasUnnamedTupleElements = node.elementTypes.some(
                    (tupleElement) => isUnnamedTupleElement(tupleElement)
                );

                if (!hasUnnamedTupleElements) {
                    return;
                }

                const usedNames = new Set<string>(
                    node.elementTypes.flatMap((tupleElement) => {
                        if (tupleElement.type !== "TSNamedTupleMember") {
                            return [];
                        }

                        if (tupleElement.label.type !== "Identifier") {
                            return [];
                        }

                        return [tupleElement.label.name];
                    })
                );

                let fixesByElement: readonly Readonly<{
                    readonly replacementText: string;
                    readonly tupleElement: es.TypeNode;
                }>[] = [];

                for (const [
                    index,
                    tupleElement,
                ] of node.elementTypes.entries()) {
                    if (!isUnnamedTupleElement(tupleElement)) {
                        continue;
                    }

                    const preferredName = `item${index + 1}`;
                    const memberName = generateUniqueTupleMemberName(
                        preferredName,
                        usedNames
                    );
                    const replacementText = getTupleMemberReplacementText(
                        tupleElement,
                        memberName,
                        sourceCode
                    );

                    fixesByElement = [
                        ...fixesByElement,
                        { replacementText, tupleElement },
                    ];
                }

                const fix = (
                    fixer: Readonly<TSESLint.RuleFixer>
                ): readonly TSESLint.RuleFix[] =>
                    fixesByElement.map(({ replacementText, tupleElement }) =>
                        fixer.replaceText(tupleElement, replacementText)
                    );

                context.report({
                    fix,
                    messageId: "forbidden",
                    node,
                    suggest: [
                        {
                            fix,
                            messageId: "suggestPreferNamedTupleMembers",
                        },
                    ],
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        deprecated: false,
        docs: {
            deprecated: false,
            description:
                "require explicit names for tuple members in TypeScript tuple types.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-prefer-named-tuple-members",
        },
        fixable: "code",
        hasSuggestions: true,
        messages: {
            forbidden:
                "Prefer named tuple members for readability and API clarity.",
            suggestPreferNamedTupleMembers:
                "Add generated names to unnamed tuple members.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "typescript/prefer-named-tuple-members",
});

export default rule;
