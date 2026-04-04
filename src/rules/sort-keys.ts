/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- ESLint fixer API callback signatures. */

import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

import { arrayFirst, arrayJoin, arrayLast, isDefined } from "ts-extras";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "incorrectSorting";

type Options = readonly [];

const keyName = (property: Readonly<es.Property>): string | undefined => {
    if (property.key.type === "Identifier") {
        return property.key.name;
    }

    if (
        property.key.type === "Literal" &&
        typeof property.key.value === "string"
    ) {
        return property.key.value;
    }

    return undefined;
};

const buildFix =
    (
        sourceCode: Readonly<TSESLint.SourceCode>,
        properties: readonly es.Property[]
    ): TSESLint.ReportFixFunction =>
    (fixer): TSESLint.RuleFix => {
        const first = arrayFirst(properties);

        const last = arrayLast(properties);
        if (first === undefined || last === undefined) {
            return fixer.insertTextAfterRange([0, 0], "");
        }

        // eslint-disable-next-line unicorn/no-array-sort -- Node >=16.0 support baseline
        const sorted = [...properties].sort((a, b) =>
            (keyName(a) ?? "").localeCompare(keyName(b) ?? "")
        );

        return fixer.replaceTextRange(
            [arrayFirst(first.range), last.range[1]],
            arrayJoin(
                sorted.map((property) => sourceCode.getText(property)),
                ", "
            )
        );
    };

/**
 * Enforce alphabetical sorting of object literal keys.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => ({
        ObjectExpression: (node: Readonly<es.ObjectExpression>): void => {
            let properties: readonly es.Property[] = [];
            for (const property of node.properties) {
                if (
                    property.type === "Property" &&
                    property.kind === "init" &&
                    !property.computed
                ) {
                    properties = [...properties, property];
                }
            }
            if (properties.length < 2) {
                return;
            }

            let previousName = "";
            let hasPreviousName = false;
            for (const property of properties) {
                const currentName = keyName(property);
                if (!isDefined(currentName)) {
                    return;
                }

                if (
                    hasPreviousName &&
                    currentName.localeCompare(previousName) < 0
                ) {
                    context.report({
                        fix: buildFix(context.sourceCode, properties),
                        messageId: "incorrectSorting",
                        node: property,
                    });
                    return;
                }

                previousName = currentName;
                hasPreviousName = true;
            }
        },
    }),
    meta: {
        deprecated: false,
        docs: {
            deprecated: false,
            description: "enforce alphabetical sorting of object literal keys.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/sort-keys",
        },
        fixable: "code",
        hasSuggestions: false,
        messages: {
            incorrectSorting:
                "Object keys should appear in alphabetical order.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "sort-keys",
});

export default rule;

/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Re-enable after file-scoped fixer callback implementations. */
