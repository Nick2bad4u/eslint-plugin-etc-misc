import writeGoodCommentsPlugin from "eslint-plugin-write-good-comments";

import {
    adaptExternalRule,
    getExternalRuleFromPlugin,
} from "../_internal/create-external-rule";

const rule = adaptExternalRule(
    getExternalRuleFromPlugin(
        writeGoodCommentsPlugin,
        "write-good-comments",
        "eslint-plugin-write-good-comments"
    ),
    "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/words.md"
);

export default rule;
