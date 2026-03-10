import type { TSESTree } from "@typescript-eslint/utils";

import parser from "@typescript-eslint/parser";
import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import * as fc from "fast-check";
import { describe, expect, it, vi } from "vitest";

import {
    buildRestrictedSyntaxListeners,
    normalizeSyntaxSelector,
} from "../../src/_internal/syntax-selectors";

const parseProgram = (code: string): TSESTree.Program =>
    parser.parseForESLint(code, {
        ecmaVersion: "latest",
        sourceType: "module",
    }).ast;

type SelectorEntry = Readonly<{
    message?: string;
    selector: string;
}>;

const assertForStatement = (
    statement: Readonly<TSESTree.Statement> | undefined
): TSESTree.ForStatement => {
    expect(statement?.type).toBe(AST_NODE_TYPES.ForStatement);

    if (statement?.type !== AST_NODE_TYPES.ForStatement) {
        throw new TypeError("Expected a ForStatement node.");
    }

    return statement;
};

describe("syntax selector normalization", () => {
    it("normalizes string selectors into selector entry objects", () => {
        fc.assert(
            fc.property(fc.string(), (selector) => {
                expect(normalizeSyntaxSelector(selector)).toEqual({ selector });
            })
        );
    });

    it("keeps object selectors with custom messages", () => {
        expect(
            normalizeSyntaxSelector({
                message: "Avoid while loops.",
                selector: "WhileStatement",
            })
        ).toEqual({
            message: "Avoid while loops.",
            selector: "WhileStatement",
        });

        expect(
            normalizeSyntaxSelector({
                selector: "ForStatement",
            })
        ).toEqual({
            selector: "ForStatement",
        });
    });
});

describe("restricted syntax listeners", () => {
    it("builds listeners that report with the matched entry payload", () => {
        const report =
            vi.fn<
                (node: Readonly<TSESTree.Node>, entry: SelectorEntry) => void
            >();
        const entries = [
            {
                message: "No while loops.",
                selector: "WhileStatement",
            },
            {
                selector: "ForStatement",
            },
        ] as const;
        const listeners = buildRestrictedSyntaxListeners(entries, report);
        const program = parseProgram("for (;;) { break; }");
        const forStatement = assertForStatement(program.body[0]);

        listeners["ForStatement"]?.(forStatement);

        expect(
            Object.keys(listeners).toSorted((left, right) =>
                left.localeCompare(right)
            )
        ).toEqual(["ForStatement", "WhileStatement"]);
        expect(report).toHaveBeenCalledTimes(1);
        expect(report).toHaveBeenCalledWith(forStatement, {
            selector: "ForStatement",
        });
    });
});
