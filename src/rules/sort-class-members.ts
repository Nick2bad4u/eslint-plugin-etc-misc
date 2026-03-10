import type { TSESTree as es } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";
import {
    createReplacementRuleInfo,
    withDeprecatedRuleLifecycle,
} from "../_internal/rule-deprecation.js";

type MessageIds = "incorrectSortingOrder";

type Options = readonly [];

const memberName = (
    member: Readonly<es.MethodDefinition | es.PropertyDefinition>
): string | undefined => {
    if (member.key.type === "Identifier") {
        return member.key.name;
    }

    if (member.key.type === "Literal" && typeof member.key.value === "string") {
        return member.key.value;
    }

    return undefined;
};

/**
 * Enforce alphabetical sorting of class members.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => ({
        ClassBody: (node: Readonly<es.ClassBody>): void => {
            const members: (es.MethodDefinition | es.PropertyDefinition)[] = [];
            for (const member of node.body) {
                if (
                    member.type === "PropertyDefinition" ||
                    member.type === "MethodDefinition"
                ) {
                    members.push(member);
                }
            }

            let previousName = "";
            let hasPreviousName = false;
            for (const member of members) {
                const currentName = memberName(member);
                if (currentName === undefined) {
                    continue;
                }

                if (
                    hasPreviousName &&
                    currentName.localeCompare(previousName) < 0
                ) {
                    context.report({
                        messageId: "incorrectSortingOrder",
                        node: member,
                    });
                    return;
                }

                previousName = currentName;
                hasPreviousName = true;
            }
        },
    }),
    defaultOptions: [],
    meta: {
        deprecated: true,
        docs: {
            deprecated: true,
            description: "enforce alphabetical sorting of class members.",
            frozen: true,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/sort-class-members",
        },
        hasSuggestions: false,
        messages: {
            incorrectSortingOrder:
                "Class members should appear in alphabetical order.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "sort-class-members",
});

/**
 * Wrapper rule with explicit lifecycle metadata and replacement mapping.
 */
const deprecatedRule: typeof rule = withDeprecatedRuleLifecycle(rule, {
    message:
        "Deprecated in favor of sort-class-members/sort-class-members or perfectionist sorting rules.",
    replacedBy: [
        createReplacementRuleInfo({
            plugin: {
                name: "sort-class-members",
                url: "https://www.npmjs.com/package/eslint-plugin-sort-class-members",
            },
            rule: {
                name: "sort-class-members",
                url: "https://www.npmjs.com/package/eslint-plugin-sort-class-members",
            },
        }),
        createReplacementRuleInfo({
            plugin: {
                name: "perfectionist",
                url: "https://perfectionist.dev/",
            },
        }),
    ],
    ruleId: "sort-class-members",
});

export default deprecatedRule;
