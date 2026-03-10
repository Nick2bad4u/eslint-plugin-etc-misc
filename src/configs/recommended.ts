/**
 * Opinionated starter preset for the plugin.
 */
export const recommended = {
    rules: {
        "etc-misc/consistent-optional-props": "warn",
        "etc-misc/no-assign-mutated-array": "error",
        "etc-misc/no-const-enum": "warn",
        "etc-misc/no-implicit-any-catch": "error",
        "etc-misc/no-internal": "error",
        "etc-misc/no-t": "error",
        "etc-misc/no-unnecessary-as-const": "warn",
        "etc-misc/no-unnecessary-break": "warn",
        "etc-misc/no-unnecessary-initialization": "warn",
        "etc-misc/no-unnecessary-template-literal": "warn",
        "etc-misc/throw-error": "error",
        "etc-misc/typescript/no-boolean-literal-type": "error",
        "etc-misc/typescript/prefer-readonly-array": "warn",
        "etc-misc/typescript/prefer-readonly-map": "warn",
        "etc-misc/typescript/prefer-readonly-property": "warn",
        "etc-misc/typescript/prefer-readonly-set": "warn",
        "etc-misc/typescript/require-this-void": "warn",
    },
} as const;
