import { stringSplit } from "ts-extras";

const camelCaseBoundaryPattern = /(?<=[\da-z])(?=[A-Z])/gu;
const nonAlphanumericPattern = /[^0-9A-Za-z]+/gu;
const whitespacePattern = /\s+/u;

/**
 * Split identifier-like text into non-empty blocks while preserving original
 * block casing.
 */
export const splitIdentifierBlocks = (value: string): readonly string[] => {
    const normalized = value
        .replaceAll(camelCaseBoundaryPattern, " ")
        .replaceAll(nonAlphanumericPattern, " ")
        .trim();

    if (normalized.length === 0) {
        return [];
    }

    return stringSplit(normalized, whitespacePattern)
        .filter((segment) => segment.length > 0);
};

/**
 * Count non-empty identifier blocks after casing/punctuation normalization.
 */
export const countIdentifierBlocks = (value: string): number =>
    splitIdentifierBlocks(value).length;
