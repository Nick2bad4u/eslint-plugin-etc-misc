import type { TSESTree as es } from "@typescript-eslint/utils";

import { basename, extname } from "node:path";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "mismatch";

type Options = readonly [];

const getFileStem = (filePath: string): string => {
    const extension = extname(filePath);
    return basename(filePath, extension);
};

/**
 * Require top-level class declarations to match the current filename.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => ({
        "Program > ExportDefaultDeclaration > ClassDeclaration > Identifier.id, Program > ExportNamedDeclaration > ClassDeclaration > Identifier.id, Program > ClassDeclaration > Identifier.id":
            (node: Readonly<es.Identifier>): void => {
                const fileName = context.filename;
                if (fileName === "<input>") {
                    return;
                }

                const fileStem = getFileStem(fileName);
                if (fileStem.length === 0 || fileStem === node.name) {
                    return;
                }

                context.report({
                    data: {
                        expected: fileStem,
                        got: node.name,
                    },
                    messageId: "mismatch",
                    node,
                });
            },
    }),
    defaultOptions: [],
    meta: {
        deprecated: false,
        docs: {
            deprecated: false,
            description: "require class names to match the current filename.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/class-match-filename",
        },
        hasSuggestions: false,
        messages: {
            mismatch:
                "Class name '{{got}}' does not match filename '{{expected}}'. Rename the class or the file.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "class-match-filename",
});

export default rule;
