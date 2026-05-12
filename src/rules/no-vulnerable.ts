import type { TSESTree as es } from "@typescript-eslint/utils";
import type { Parameters as RecheckParameters } from "recheck";
import type { UnknownRecord } from "type-fest";

import { statSync } from "node:fs";
import { createRequire } from "node:module";
import { basename, dirname, join } from "node:path";
import { checkSync } from "recheck";
import { arrayFirst, isDefined, keyIn, setHas } from "ts-extras";

import { ruleCreator } from "../_internal/rule-creator.js";

type ComplexityType = "exponential" | "polynomial";

type MessageIds = "checkerError" | "vulnerable";

type Options = readonly [RuleOption?];

type RecheckDiagnostics = ReturnType<typeof checkSync>;

type RecheckEnvironmentKey = "RECHECK_BIN" | "RECHECK_JAR";

type RecheckEnvironmentOverrides = Readonly<
    Partial<Record<RecheckEnvironmentKey, string>>
>;

type RuleOption = Readonly<
    RecheckParameters & {
        readonly ignoreErrors?: boolean;
        readonly permittableComplexities?: readonly ComplexityType[];
    }
>;

const requireFromWorkingDirectory = createRequire(
    join(process.cwd(), "package.json")
);

const isUnknownRecord = (value: unknown): value is UnknownRecord =>
    typeof value === "object" && value !== null && !Array.isArray(value);

const isModuleNotFoundError = (error: unknown): boolean => {
    if (!isUnknownRecord(error)) {
        return false;
    }

    return keyIn(error, "code") && error["code"] === "MODULE_NOT_FOUND";
};

const createRequireFromPluginPackage = (): ReturnType<typeof createRequire> => {
    try {
        return createRequire(
            requireFromWorkingDirectory.resolve(
                "eslint-plugin-etc-misc/package.json"
            )
        );
    } catch (error) {
        if (isModuleNotFoundError(error)) {
            return requireFromWorkingDirectory;
        }

        throw error;
    }
};

const requireFromPluginPackage = createRequireFromPluginPackage();

const isExistingFile = (filePath: string): boolean => {
    try {
        return statSync(filePath).isFile();
    } catch {
        return false;
    }
};

const shouldOverrideRuntimePath = (currentPath: string | undefined): boolean =>
    !isDefined(currentPath) ||
    !isExistingFile(currentPath) ||
    basename(currentPath).toLowerCase() === "package.json";

const resolvePackageSiblingFile = (
    packageJsonSpecifier: string,
    siblingFileName: string
): null | string => {
    try {
        const packageJsonPath =
            requireFromPluginPackage.resolve(packageJsonSpecifier);

        return join(dirname(packageJsonPath), siblingFileName);
    } catch (error) {
        if (isModuleNotFoundError(error)) {
            return null;
        }

        throw error;
    }
};

const resolveRecheckJarPath = (): null | string =>
    resolvePackageSiblingFile("recheck-jar/package.json", "recheck.jar");

const resolveRecheckWindowsBinaryPath = (): null | string => {
    if (process.platform !== "win32" || process.arch !== "x64") {
        return null;
    }

    return resolvePackageSiblingFile(
        "recheck-windows-x64/package.json",
        "recheck.exe"
    );
};

const recheckJarPath =
    process.platform === "win32" ? resolveRecheckJarPath() : null;

const recheckWindowsBinaryPath =
    process.platform === "win32" ? resolveRecheckWindowsBinaryPath() : null;

/* eslint-disable n/no-process-env -- recheck exposes backend runtime paths only through environment variables, so the rule temporarily normalizes them while invoking the analyzer. */

const deleteRecheckEnvironmentValue = (key: RecheckEnvironmentKey): void => {
    if (key === "RECHECK_BIN") {
        delete process.env["RECHECK_BIN"];

        return;
    }

    delete process.env["RECHECK_JAR"];
};

const getRecheckEnvironmentValue = (
    key: RecheckEnvironmentKey
): string | undefined =>
    key === "RECHECK_BIN"
        ? process.env["RECHECK_BIN"]
        : process.env["RECHECK_JAR"];

const setRecheckEnvironmentValue = (
    key: RecheckEnvironmentKey,
    value: string
): void => {
    if (key === "RECHECK_BIN") {
        process.env["RECHECK_BIN"] = value;

        return;
    }

    process.env["RECHECK_JAR"] = value;
};

const getRecheckEnvironmentOverrides = (): RecheckEnvironmentOverrides => {
    if (process.platform !== "win32") {
        return {};
    }

    const overrides: Partial<Record<RecheckEnvironmentKey, string>> = {};

    if (
        recheckJarPath !== null &&
        isExistingFile(recheckJarPath) &&
        shouldOverrideRuntimePath(getRecheckEnvironmentValue("RECHECK_JAR"))
    ) {
        overrides.RECHECK_JAR = recheckJarPath;
    }

    if (
        recheckWindowsBinaryPath !== null &&
        isExistingFile(recheckWindowsBinaryPath) &&
        shouldOverrideRuntimePath(getRecheckEnvironmentValue("RECHECK_BIN"))
    ) {
        overrides.RECHECK_BIN = recheckWindowsBinaryPath;
    }

    return overrides;
};

const restoreEnvironmentValue = (
    key: RecheckEnvironmentKey,
    value: string | undefined
): void => {
    if (!isDefined(value)) {
        deleteRecheckEnvironmentValue(key);

        return;
    }

    setRecheckEnvironmentValue(key, value);
};

const withRecheckEnvironmentOverrides = <TResult>(
    callback: () => TResult
): TResult => {
    const overrides = getRecheckEnvironmentOverrides();
    const previousBin = getRecheckEnvironmentValue("RECHECK_BIN");
    const previousJar = getRecheckEnvironmentValue("RECHECK_JAR");

    if (isDefined(overrides.RECHECK_BIN)) {
        setRecheckEnvironmentValue("RECHECK_BIN", overrides.RECHECK_BIN);
    }

    if (isDefined(overrides.RECHECK_JAR)) {
        setRecheckEnvironmentValue("RECHECK_JAR", overrides.RECHECK_JAR);
    }

    try {
        return callback();
    } finally {
        restoreEnvironmentValue("RECHECK_BIN", previousBin);
        restoreEnvironmentValue("RECHECK_JAR", previousJar);
    }
};

const runRecheck = (
    source: string,
    flags: string,
    parameters: Readonly<RecheckParameters>
): RecheckDiagnostics =>
    withRecheckEnvironmentOverrides(() => checkSync(source, flags, parameters));

/* eslint-enable n/no-process-env -- Re-enable after the recheck environment wrapper helpers. */

const getStaticStringValue = (node: Readonly<es.Expression>): null | string => {
    if (node.type === "Literal" && typeof node.value === "string") {
        return node.value;
    }

    if (
        node.type === "TemplateLiteral" &&
        node.expressions.length === 0 &&
        node.quasis.length === 1
    ) {
        return arrayFirst(node.quasis)?.value.cooked ?? null;
    }

    return null;
};

const isNonSpreadArgument = (
    argument: Readonly<es.CallExpressionArgument>
): argument is Readonly<es.Expression> => argument.type !== "SpreadElement";

const isRegExpConstructorCall = (
    node: Readonly<es.CallExpression | es.NewExpression>
): boolean => {
    if (node.callee.type !== "Identifier" || node.callee.name !== "RegExp") {
        return false;
    }

    if (node.arguments.length === 0 || node.arguments.length > 2) {
        return false;
    }

    const sourceArgument = arrayFirst(node.arguments);

    if (!isDefined(sourceArgument) || !isNonSpreadArgument(sourceArgument)) {
        return false;
    }

    const sourceValue = getStaticStringValue(sourceArgument);

    if (sourceValue === null) {
        return false;
    }

    const flagsArgument = node.arguments[1];

    if (flagsArgument === undefined) {
        return true;
    }

    if (flagsArgument.type === "SpreadElement") {
        return false;
    }

    return isDefined(getStaticStringValue(flagsArgument));
};

const getStaticFlagsValue = (
    argument: Readonly<es.CallExpressionArgument> | undefined
): null | string => {
    if (!isDefined(argument)) {
        return "";
    }

    if (!isNonSpreadArgument(argument)) {
        return null;
    }

    return getStaticStringValue(argument);
};

const getDiagnosticsErrorMessage = (
    error: Readonly<{
        readonly kind: string;
        readonly message?: string;
    }>
): string => {
    if (keyIn(error, "message") && typeof error.message === "string") {
        return error.message;
    }

    return "No additional details provided.";
};

const getThrownErrorMessage = (error: unknown): string => {
    if (error instanceof Error && error.message.length > 0) {
        return error.message;
    }

    if (typeof error === "string" && error.length > 0) {
        return error;
    }

    return "No additional details provided.";
};

/**
 * Detect ReDoS-vulnerable regular expressions using `recheck`.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context, [rawOptions]) => {
        const options = rawOptions ?? {};
        const {
            ignoreErrors = true,
            permittableComplexities = [],
            ...recheckParameters
        } = options;
        const allowedComplexities = new Set(permittableComplexities);

        const reportDiagnostics = (
            node: Readonly<es.Node>,
            source: string,
            flags: string
        ): void => {
            const diagnostics = (() => {
                try {
                    return runRecheck(source, flags, recheckParameters);
                } catch (error) {
                    if (ignoreErrors) {
                        return null;
                    }

                    context.report({
                        data: {
                            kind: "unexpected",
                            message: getThrownErrorMessage(error),
                        },
                        messageId: "checkerError",
                        node,
                    });

                    return null;
                }
            })();

            if (diagnostics === null) {
                return;
            }

            if (diagnostics.status === "safe") {
                return;
            }

            if (diagnostics.status === "vulnerable") {
                if (setHas(allowedComplexities, diagnostics.complexity.type)) {
                    return;
                }

                context.report({
                    data: {
                        summary: diagnostics.complexity.summary,
                    },
                    messageId: "vulnerable",
                    node,
                });

                return;
            }

            if (ignoreErrors) {
                return;
            }

            context.report({
                data: {
                    kind: diagnostics.error.kind,
                    message: getDiagnosticsErrorMessage(diagnostics.error),
                },
                messageId: "checkerError",
                node,
            });
        };

        return {
            CallExpression: (node: Readonly<es.CallExpression>): void => {
                if (!isRegExpConstructorCall(node)) {
                    return;
                }

                const sourceArgument = arrayFirst(node.arguments);

                if (
                    !isDefined(sourceArgument) ||
                    !isNonSpreadArgument(sourceArgument)
                ) {
                    return;
                }

                const source = getStaticStringValue(sourceArgument);
                const secondArgument = node.arguments[1];
                const flags = getStaticFlagsValue(secondArgument);

                if (source === null || flags === null) {
                    return;
                }

                reportDiagnostics(node, source, flags);
            },
            Literal: (node: Readonly<es.Literal>): void => {
                if (!(node.value instanceof RegExp)) {
                    return;
                }

                reportDiagnostics(node, node.value.source, node.value.flags);
            },
            NewExpression: (node: Readonly<es.NewExpression>): void => {
                if (!isRegExpConstructorCall(node)) {
                    return;
                }

                const sourceArgument = arrayFirst(node.arguments);

                if (
                    !isDefined(sourceArgument) ||
                    !isNonSpreadArgument(sourceArgument)
                ) {
                    return;
                }

                const source = getStaticStringValue(sourceArgument);
                const secondArgument = node.arguments[1];
                const flags = getStaticFlagsValue(secondArgument);

                if (source === null || flags === null) {
                    return;
                }

                reportDiagnostics(node, source, flags);
            },
        };
    },
    meta: {
        defaultOptions: [{}],
        deprecated: false,
        docs: {
            deprecated: false,
            description: "disallow ReDoS-vulnerable regular expressions.",
            frozen: false,
            recommended: true,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-vulnerable",
        },
        hasSuggestions: false,
        messages: {
            checkerError:
                "ReDoS analysis failed ({{kind}}): {{message}}. Consider setting ignoreErrors to true for this pattern.",
            vulnerable:
                "Potential ReDoS-vulnerable regular expression detected ({{summary}}).",
        },
        schema: [
            {
                additionalProperties: false,
                description:
                    "Configuration for ReDoS analysis, including recheck parameters and local rule behavior flags.",
                properties: {
                    ignoreErrors: {
                        description:
                            "Whether to suppress errors returned by the ReDoS analyzer.",
                        type: "boolean",
                    },
                    permittableComplexities: {
                        description:
                            "List of vulnerable complexity categories to permit without reporting.",
                        items: {
                            enum: ["polynomial", "exponential"],
                            type: "string",
                        },
                        type: "array",
                        uniqueItems: true,
                    },
                    timeout: {
                        description:
                            "Maximum analysis time budget in milliseconds passed through to recheck.",
                        type: ["number", "null"],
                    },
                },
                type: "object",
            },
        ],
        type: "problem",
    },
    name: "no-vulnerable",
});

export default rule;
