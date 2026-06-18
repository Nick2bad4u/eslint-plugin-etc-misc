import { describe, expect, it } from "vitest";

import remarkLintRuleDocHeadings from "../../scripts/remark-lint-rule-doc-headings.mjs";

type CapturedMessage = Readonly<{
    reason: string;
    ruleId: string;
}>;

type HeadingNode = Readonly<{
    children: readonly TextNode[];
    depth: 1 | 2;
    type: "heading";
}>;

type RootNode = Readonly<{
    children: readonly HeadingNode[];
    type: "root";
}>;

type TextNode = Readonly<{
    type: "text";
    value: string;
}>;

class MockVFile {
    public readonly messages: CapturedMessage[] = [];
    public readonly path: string;
    private readonly markdownContent: string;

    public constructor(path: string, markdownContent: string) {
        this.path = path;
        this.markdownContent = markdownContent;
    }

    public message(reason: string, _node: unknown, ruleId: string): void {
        this.messages.push({ reason, ruleId });
    }

    public toString(): string {
        return this.markdownContent;
    }
}

const requiredH2Headings = [
    "✅ Correct",
    "❌ Incorrect",
    "Further reading",
    "Package documentation",
    "Targeted pattern scope",
    "What this rule reports",
    "Why this rule exists",
] as const;

const createHeading = (depth: 1 | 2, text: string): HeadingNode => ({
    children: [{ type: "text", value: text }],
    depth,
    type: "heading",
});

const createValidRuleDocTree = (): RootNode => ({
    children: [
        createHeading(1, "typescript/prefer-readonly-index-signature"),
        ...requiredH2Headings.map((headingName) =>
            createHeading(2, headingName)
        ),
    ],
    type: "root",
});

const runRuleDocHeadingLint = (markdownContent: string): CapturedMessage[] => {
    const transformer = remarkLintRuleDocHeadings.call(
        {} as never
    ) as unknown as (tree: RootNode, file: Readonly<MockVFile>) => void;
    const file = new MockVFile(
        "docs/rules/typescript-prefer-readonly-index-signature.md",
        markdownContent
    );

    transformer(createValidRuleDocTree(), file);

    return file.messages;
};

const hasRuleId = (
    messages: readonly CapturedMessage[],
    ruleId: string
): boolean => messages.some((message) => message.ruleId === ruleId);

describe("remark-lint-rule-doc-headings catalog marker", () => {
    it("reports when the rule catalog marker is missing", () => {
        expect.hasAssertions();

        const messages = runRuleDocHeadingLint("## Further reading\n\n- link");

        expect(
            hasRuleId(
                messages,
                "remark-lint:rule-doc-headings:missing-rule-catalog-id"
            )
        ).toBe(true);
    });

    it("reports when duplicate rule catalog markers are present", () => {
        expect.hasAssertions();

        const messages = runRuleDocHeadingLint(
            ["> **Rule catalog ID:** R099", "> **Rule catalog ID:** R100"].join(
                "\n"
            )
        );

        expect(
            hasRuleId(
                messages,
                "remark-lint:rule-doc-headings:duplicate-rule-catalog-id"
            )
        ).toBe(true);
        expect(
            hasRuleId(
                messages,
                "remark-lint:rule-doc-headings:missing-rule-catalog-id"
            )
        ).toBe(false);
    });

    it("accepts exactly one rule catalog marker", () => {
        expect.hasAssertions();

        const messages = runRuleDocHeadingLint("> **Rule catalog ID:** R099");

        expect(
            hasRuleId(
                messages,
                "remark-lint:rule-doc-headings:missing-rule-catalog-id"
            )
        ).toBe(false);
        expect(
            hasRuleId(
                messages,
                "remark-lint:rule-doc-headings:duplicate-rule-catalog-id"
            )
        ).toBe(false);
    });
});
