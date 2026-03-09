/**
 * Compiled ignore-pattern result grouped by mode with invalid entries tracked.
 */
export type CompiledIgnorePatterns = Readonly<{
    invalidPatterns: readonly string[];
    patterns: IgnorePatternBuckets;
}>;

/**
 * Supported matching modes for symbol-ignore configuration.
 */
export type IgnoreMode = "name" | "path";

/**
 * Compiled regex buckets for name- and path-based ignores.
 */
export type IgnorePatternBuckets = Readonly<{
    name: readonly RegExp[];
    path: readonly RegExp[];
}>;

/* eslint-disable security/detect-non-literal-regexp -- Rule options intentionally accept user-provided regex strings. */
/**
 * Compile ignore-option regex patterns into mode buckets.
 *
 * Invalid regex patterns are returned for caller-side reporting so rule
 * configuration issues are never swallowed silently.
 */
export const compileIgnorePatterns = (
    ignored: Readonly<Record<string, IgnoreMode>>
): CompiledIgnorePatterns => {
    const namePatterns: RegExp[] = [];
    const pathPatterns: RegExp[] = [];
    const invalidPatterns: string[] = [];

    for (const [pattern, mode] of Object.entries(ignored)) {
        try {
            const regularExpression = new RegExp(pattern, "u");
            if (mode === "name") {
                namePatterns.push(regularExpression);
            } else {
                pathPatterns.push(regularExpression);
            }
        } catch {
            invalidPatterns.push(pattern);
        }
    }

    return {
        invalidPatterns,
        patterns: {
            name: namePatterns,
            path: pathPatterns,
        },
    };
};
/* eslint-enable security/detect-non-literal-regexp -- Re-enable dynamic-regex checks outside option pattern compilation. */
