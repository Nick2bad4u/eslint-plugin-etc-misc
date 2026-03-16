/**
 * Compiled ignore-pattern result grouped by mode with invalid entries tracked.
 */
import { objectEntries } from "ts-extras";

export type CompiledIgnorePatterns = Readonly<{
    readonly invalidPatterns: readonly string[];
    readonly patterns: IgnorePatternBuckets;
}>;

/**
 * Supported matching modes for symbol-ignore configuration.
 */
export type IgnoreMode = "name" | "path";

/**
 * Compiled regex buckets for name- and path-based ignores.
 */
export type IgnorePatternBuckets = Readonly<{
    readonly name: readonly RegExp[];
    readonly path: readonly RegExp[];
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
    let namePatterns: readonly RegExp[] = [];
    let pathPatterns: readonly RegExp[] = [];
    let invalidPatterns: readonly string[] = [];

    for (const [pattern, mode] of objectEntries(ignored)) {
        try {
            const regularExpression = new RegExp(pattern, "u");
            if (mode === "name") {
                namePatterns = [...namePatterns, regularExpression];
            } else {
                pathPatterns = [...pathPatterns, regularExpression];
            }
        } catch {
            invalidPatterns = [...invalidPatterns, pattern];
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
