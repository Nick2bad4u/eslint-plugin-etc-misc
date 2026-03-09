/* eslint-disable vitest/consistent-test-it, vitest/expect-expect, vitest/require-top-level-describe, vitest/valid-describe-callback -- RuleTester adapter assigns Vitest hooks/callbacks, not test cases. */

import parser from "@typescript-eslint/parser";
import { RuleTester } from "@typescript-eslint/rule-tester";
import { afterAll, describe, it } from "vitest";

RuleTester.afterAll = afterAll;
RuleTester.describe = (name, callback): void => {
    describe(name, callback);
};
RuleTester.it = (name, callback): void => {
    it(name, callback);
};

export const ruleTester: RuleTester = new RuleTester({
    languageOptions: {
        parser,
        parserOptions: {
            ecmaVersion: "latest",
            projectService: {
                allowDefaultProject: ["*.ts"],
            },
            sourceType: "module",
            tsconfigRootDir: process.cwd(),
        },
    },
});

type AnyMessageError = Readonly<{
    messageId: string;
}>;

type AnyMessageErrorOptions = Readonly<{
    suggestions?: null | number | readonly unknown[];
}>;

/**
 * RuleTester runtime still supports regex `message` assertions, but the current
 * test-case type only models `messageId` assertions.
 */
export const anyMessageError = (pattern: Readonly<RegExp>): AnyMessageError =>
    ({ message: pattern }) as unknown as AnyMessageError;

export const anyMessageErrorWithOptions = (
    pattern: Readonly<RegExp>,
    options: AnyMessageErrorOptions
): AnyMessageError =>
    ({ message: pattern, ...options }) as unknown as AnyMessageError;

/* eslint-enable vitest/consistent-test-it, vitest/expect-expect, vitest/require-top-level-describe, vitest/valid-describe-callback -- Re-enable Vitest test-shape rules outside this RuleTester adapter. */
