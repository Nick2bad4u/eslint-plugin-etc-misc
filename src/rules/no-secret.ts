import noSecretsPlugin from "eslint-plugin-no-secrets";

import {
    adaptExternalRule,
    getExternalRuleFromPlugin,
} from "../_internal/create-external-rule";

const rule = adaptExternalRule(
    getExternalRuleFromPlugin(
        noSecretsPlugin,
        "no-secrets",
        "eslint-plugin-no-secrets"
    ),
    "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/no-secret.md"
);

export default rule;
