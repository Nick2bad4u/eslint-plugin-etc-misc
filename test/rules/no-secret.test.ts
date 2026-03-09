import rule from "../../src/rules/no-secret";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("no-secret", rule, {
    invalid: [
        {
            code: 'const token = "SECRET_ABCD";',
            errors: [{ message: /.+/v }],
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
