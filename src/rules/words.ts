import writeGoodCommentsPlugin from "eslint-plugin-write-good-comments";

import {
    adaptExternalRule,
    getExternalRuleFromPlugin,
} from "../_internal/create-external-rule";

/**
 * Proxy of external `write-good-comments/write-good-comments`.
 */
const rule: ReturnType<typeof adaptExternalRule> = adaptExternalRule(
    getExternalRuleFromPlugin(
        writeGoodCommentsPlugin,
        "write-good-comments",
        "eslint-plugin-write-good-comments"
    ),
    "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/words.md"
);

export default rule;
