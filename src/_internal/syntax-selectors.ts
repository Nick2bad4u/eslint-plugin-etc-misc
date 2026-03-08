import type {
    TSESTree as es,
} from "@typescript-eslint/utils";

/**
 * Normalized selector entry used by syntax-based rules.
 */
export type SyntaxSelectorEntry = Readonly<{
    message?: string;
    selector: string;
}>;

/**
 * Supported selector option syntax accepted by rule options.
 */
export type SyntaxSelectorOption =
    | Readonly<{
          message?: string;
          selector: string;
      }>
    | string;

const isSelectorObject = (
    value: SyntaxSelectorOption
): value is Readonly<{ message?: string; selector: string }> =>
    typeof value === "object" && value !== null && "selector" in value;

/**
 * Normalize a selector option into a selector entry object.
 */
export const normalizeSyntaxSelector = (
    selector: SyntaxSelectorOption
): SyntaxSelectorEntry => {
    if (isSelectorObject(selector)) {
        return {
            message: selector.message,
            selector: selector.selector,
        };
    }

    return {
        selector,
    };
};

/**
 * Build ESLint selector listeners from selector entries.
 */
export const buildRestrictedSyntaxListeners = (
    entries: readonly SyntaxSelectorEntry[],
    report: (node: Readonly<es.Node>, entry: SyntaxSelectorEntry) => void
): Readonly<Record<string, (node: Readonly<es.Node>) => void>> =>
    Object.fromEntries(
        entries.map((entry) => [
            entry.selector,
            (node: Readonly<es.Node>): void => {
                report(node, entry);
            },
        ])
    );
