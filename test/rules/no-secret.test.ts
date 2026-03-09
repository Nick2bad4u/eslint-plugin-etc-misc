import deprecatedRule from "../../src/rules/no-secret";
import { anyMessageError, ruleTester } from "../_internal/ruleTester";

ruleTester.run("no-secret", deprecatedRule, {
    invalid: [
        {
            code: 'const token = "SECRET_ABCD";',
            errors: [anyMessageError(/.+/v)],
            options: [
                {
                    additionalRegexes: {
                        testSecret: "SECRET_[A-Z]{4}",
                    },
                },
            ],
        },
    ],
    valid: [
        {
            code: 'const token = "PUBLIC_ABCD";',
            options: [
                {
                    additionalRegexes: {
                        testSecret: "SECRET_[A-Z]{4}",
                    },
                },
            ],
        },
    ],
});
