import type { TSESTree as es } from "@typescript-eslint/utils";

import { ruleCreator } from "./rule-creator";

type CreateSelectorRuleInput = Readonly<{
    description: string;
    message: string;
    messageId: string;
    name: string;
    selector: string;
    type: "problem" | "suggestion";
    url: string;
}>;

type Options = readonly [];

/**
 * Create a no-options rule that reports every node matching the provided
 * selector.
 */
export const createSelectorRule = (
    input: CreateSelectorRuleInput
): ReturnType<typeof ruleCreator<Options, string>> =>
    ruleCreator<Options, string>({
        create: (context) => ({
            [input.selector]: (node: Readonly<es.Node>): void => {
                context.report({
                    messageId: input.messageId,
                    node,
                });
            },
        }),
        defaultOptions: [],
        meta: {
            docs: {
                description: input.description,
                recommended: false,
                url: input.url,
            },
            hasSuggestions: false,
            messages: {
                [input.messageId]: input.message,
            },
            schema: [],
            type: input.type,
        },
        name: input.name,
    });
