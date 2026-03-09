/**
 * @license Use of this source code is governed by an MIT-style license that can
 *   be found in the LICENSE file at
 *   https://github.com/cartant/eslint-plugin-etc
 */

import type { TSESTree as es } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator";

const defaultOptions: readonly {
    prefix?: string;
}[] = [{}];

type MessageIds = "forbidden" | "prefix";

/**
 * Disallow non-descriptive single-character generic type parameter names.
 */
const rule: ReturnType<typeof ruleCreator<typeof defaultOptions, MessageIds>> =
    ruleCreator<typeof defaultOptions, MessageIds>({
        create: (context) => {
            const [{ prefix = "" } = {}] = context.options;
            return {
                "TSTypeParameter > Identifier[name=/^.$/]": (
                    node: Readonly<es.Identifier>
                ) => {
                    context.report({
                        data: { name: node.name },
                        messageId: "forbidden",
                        node,
                    });
                },
                "TSTypeParameter > Identifier[name=/^.{2,}$/]": (
                    node: Readonly<es.Identifier>
                ) => {
                    const { name } = node;
                    if (prefix && !name.startsWith(prefix)) {
                        context.report({
                            data: { name, prefix },
                            messageId: "prefix",
                            node,
                        });
                    }
                },
            };
        },
        defaultOptions,
        meta: {
            defaultOptions: [{}],
            docs: {
                description: "disallow single-character type parameters.",
                recommended: false,
                url: "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/no-t.md",
            },
            hasSuggestions: false,
            messages: {
                forbidden: `Single-character type parameters are forbidden. Choose a more descriptive name for "{{name}}"`,
                prefix: `Type parameter "{{name}}" does not have prefix "{{prefix}}"`,
            },
            schema: [
                {
                    description:
                        "Configuration for enforced generic type parameter prefix.",
                    properties: {
                        prefix: {
                            description:
                                "Required prefix for type parameter names longer than one character.",
                            type: "string",
                        },
                    },
                    type: "object",
                },
            ],
            type: "problem",
        },
        name: "no-t",
    });

export default rule;
