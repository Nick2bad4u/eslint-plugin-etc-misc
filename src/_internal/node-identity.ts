import type { TSESTree as es } from "@typescript-eslint/utils";

/** Return whether two ESTree node references identify the same AST node. */
export const isSameNode = (
    left:
        | null
        | Readonly<es.Node>
        | undefined,
    right:
        | null
        | Readonly<es.Node>
        | undefined
): boolean => Object.is(left, right);
