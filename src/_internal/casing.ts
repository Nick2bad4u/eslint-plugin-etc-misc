import { arrayAt, arrayJoin, stringSplit } from "ts-extras";

import { splitIdentifierBlocks } from "./identifier-blocks.js";

/**
 * Supported casing formats for identifier transformations.
 */
export type Casing = "camelCase" | "kebab-case" | "PascalCase";

const splitWords = (value: string): readonly string[] =>
    splitIdentifierBlocks(value).map((word) => word.toLowerCase());

const toPascal = (value: string): string =>
    arrayJoin(
        splitWords(value).map(
            (word) => `${word.at(0)?.toUpperCase() ?? ""}${word.slice(1)}`
        ),
        ""
    );

/**
 * Convert an input string into the requested casing format.
 */
export const toCasing = (value: string, format: Casing): string => {
    switch (format) {
        case "camelCase": {
            const pascal = toPascal(value);
            return `${pascal.at(0)?.toLowerCase() ?? ""}${pascal.slice(1)}`;
        }

        case "kebab-case": {
            return arrayJoin(splitWords(value), "-");
        }

        case "PascalCase": {
            return toPascal(value);
        }

        default: {
            return value;
        }
    }
};

/**
 * Extract the final filename segment without extension.
 */
export const filenameStem = (filePath: string): string => {
    const normalizedPath = filePath.replaceAll("\\", "/");
    const pathSegments = stringSplit(normalizedPath, "/");
    const lastPathSegment = arrayAt(pathSegments, -1) ?? filePath;

    return lastPathSegment.replace(/\.[^.\/]+$/v, "");
};
