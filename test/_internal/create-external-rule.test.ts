import { AST_NODE_TYPES, type TSESLint } from "@typescript-eslint/utils";
import { describe, expect, it } from "vitest";

import { adaptExternalRule } from "../../src/_internal/create-external-rule";
import { ruleTester } from "./ruleTester";

describe("external rule adaptation", () => {
    it("throws when the external module does not expose create", () => {
        expect.hasAssertions();
        expect(() =>
            adaptExternalRule({}, "https://example.com/rules/my-rule")
        ).toThrow(
            new TypeError("External rule module does not expose create().")
        );
    });

    it("fills default options and docs metadata when absent", () => {
        expect.hasAssertions();

        const adaptedRule = adaptExternalRule(
            {
                create: (): Readonly<Record<string, never>> => ({}),
                meta: {
                    docs: {
                        description: "Adapted rule",
                    },
                },
            },
            "https://example.com/rules/adapted"
        );

        expect(adaptedRule.meta?.docs?.url).toBe(
            "https://example.com/rules/adapted"
        );
        expect(adaptedRule.meta?.docs?.description).toBe("Adapted rule");
    });

    it("keeps only string-valued external messages", () => {
        expect.hasAssertions();

        const adaptedRule = adaptExternalRule(
            {
                create: (): Readonly<Record<string, never>> => ({}),
                meta: {
                    messages: {
                        invalid: 42,
                        valid: "Valid external message.",
                    },
                },
            },
            "https://example.com/rules/adapted"
        );

        expect(adaptedRule.meta?.messages).toStrictEqual({
            valid: "Valid external message.",
        });
    });
});

type ExternalRuleMessageId = "forbiddenIdentifier";

type LegacyContextCompat = Readonly<{
    getCwd?: () => string;
    getFilename?: () => string;
    getPhysicalFilename?: () => string;
    getSourceCode?: () => Readonly<TSESLint.SourceCode>;
}> &
    TSESLint.RuleContext<ExternalRuleMessageId, readonly unknown[]>;

const isSourceCode = (value: unknown): value is Readonly<TSESLint.SourceCode> =>
    typeof value === "object" &&
    value !== null &&
    typeof Reflect.get(value, "getText") === "function";

const callLegacyStringMethod = (
    context: LegacyContextCompat,
    methodName:
        | "getCwd"
        | "getFilename"
        | "getPhysicalFilename"
): string => {
    const candidateMethod = Reflect.get(context, methodName);

    if (typeof candidateMethod !== "function") {
        throw new TypeError(`Legacy method ${methodName}() is not available.`);
    }

    const methodResult = Reflect.apply(candidateMethod, context, []);
    if (typeof methodResult !== "string") {
        throw new TypeError(
            `Legacy method ${methodName}() did not return a string.`
        );
    }

    return methodResult;
};

const callLegacySourceCodeMethod = (
    context: LegacyContextCompat
): Readonly<TSESLint.SourceCode> => {
    const candidateMethod = Reflect.get(context, "getSourceCode");

    if (typeof candidateMethod !== "function") {
        throw new TypeError("Legacy method getSourceCode() is not available.");
    }

    const methodResult = Reflect.apply(candidateMethod, context, []);
    if (!isSourceCode(methodResult)) {
        throw new TypeError(
            "Legacy method getSourceCode() did not return a SourceCode-like object."
        );
    }

    return methodResult;
};

const legacyAwareExternalRule: TSESLint.RuleModule<
    ExternalRuleMessageId,
    readonly unknown[]
> = {
    create: (context) => {
        const legacyContext = context as LegacyContextCompat;
        const legacySourceCode = callLegacySourceCodeMethod(legacyContext);
        const legacyFilename = callLegacyStringMethod(
            legacyContext,
            "getFilename"
        );
        const legacyPhysicalFilename = callLegacyStringMethod(
            legacyContext,
            "getPhysicalFilename"
        );
        const legacyCurrentWorkingDirectory = callLegacyStringMethod(
            legacyContext,
            "getCwd"
        );

        if (
            legacyFilename.length === 0 ||
            legacyPhysicalFilename.length === 0 ||
            legacyCurrentWorkingDirectory.length === 0
        ) {
            throw new TypeError("Expected non-empty legacy context values.");
        }

        return {
            Program: (node) => {
                if (node.type !== AST_NODE_TYPES.Program) {
                    throw new TypeError("Expected Program node.");
                }

                const programText = legacySourceCode.getText(node);

                if (programText.includes("triggerIdentifier")) {
                    context.report({
                        messageId: "forbiddenIdentifier",
                        node,
                    });
                }
            },
        };
    },
    meta: {
        docs: {
            description: "Legacy-compatible external rule",
            url: "https://external.example/rules/legacy-compatible",
        },
        messages: {
            forbiddenIdentifier:
                "Identifiers containing triggerIdentifier are not allowed.",
        },
        schema: [],
        type: "problem",
    },
};

ruleTester.run(
    "adaptExternalRule legacy-context compatibility",
    adaptExternalRule(
        legacyAwareExternalRule,
        "https://example.com/rules/legacy-compatible"
    ),
    {
        invalid: [
            {
                code: "const triggerIdentifier = 1;",
                errors: [{ messageId: "forbiddenIdentifier" }],
            },
        ],
        valid: [
            {
                code: "const safeIdentifier = 1;",
            },
        ],
    }
);
