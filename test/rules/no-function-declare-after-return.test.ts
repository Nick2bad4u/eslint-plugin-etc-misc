import rule from "../../src/rules/no-function-declare-after-return";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("no-function-declare-after-return", rule, {
    invalid: [
        // Basic: single function declaration after return
        {
            code: `
function outer() {
    return 42;
    function helper() {}
}`.trim(),
            errors: [
                {
                    data: { name: "helper" },
                    messageId: "forbidden",
                },
            ],
            output: `
function outer() {
    function helper() {}
    return 42;
}`.trim(),
        },
        // Multiple function declarations after return
        {
            code: `
function outer() {
    return true;
    function a() {}
    function b() {}
}`.trim(),
            errors: [
                {
                    data: { name: "a" },
                    messageId: "forbidden",
                },
                {
                    data: { name: "b" },
                    messageId: "forbidden",
                },
            ],
            // ESLint applies fixes iteratively when they conflict (both insert
            // before the same return statement). Each element is the code after
            // that many fix passes.
            output: [
                // Pass 1: fixes conflict so only first fix applied (function a)
                `
function outer() {
    function a() {}
    return true;
    function b() {}
}`.trim(),
                // Pass 2: function b also moved before return
                `
function outer() {
    function a() {}
    function b() {}
    return true;
}`.trim(),
            ],
        },
        // Nested function: inner function has its own return + declaration
        {
            code: `
function outer() {
    function inner() {
        return 1;
        function nested() {}
    }
}`.trim(),
            errors: [
                {
                    data: { name: "nested" },
                    messageId: "forbidden",
                },
            ],
            output: `
function outer() {
    function inner() {
        function nested() {}
        return 1;
    }
}`.trim(),
        },
        // Inside an if-block
        {
            code: `
function publicMethods(obj) {
    if (obj) {
        return {
            get: getter(obj),
        };
        function getter(o) { return o; }
    }
}`.trim(),
            errors: [
                {
                    data: { name: "getter" },
                    messageId: "forbidden",
                },
            ],
            output: `
function publicMethods(obj) {
    if (obj) {
        function getter(o) { return o; }
        return {
            get: getter(obj),
        };
    }
}`.trim(),
        },
        // Multi-line function body declaration after return
        {
            code: `
function outer() {
    return null;
    function multiLine() {
        const x = 1;
        return x;
    }
}`.trim(),
            errors: [
                {
                    data: { name: "multiLine" },
                    messageId: "forbidden",
                },
            ],
            output: `
function outer() {
    function multiLine() {
        const x = 1;
        return x;
    }
    return null;
}`.trim(),
        },
        // Preserve leading comment lines when moving declaration
        {
            code: `
function outer() {
    return 1;
    // helper preserves old fallback behavior
    function helper() {
        return 2;
    }
}`.trim(),
            errors: [
                {
                    data: { name: "helper" },
                    messageId: "forbidden",
                },
            ],
            output: `
function outer() {
    // helper preserves old fallback behavior
    function helper() {
        return 2;
    }
    return 1;
}`.trim(),
        },
        // Preserve leading JSDoc blocks when moving declaration
        {
            code: `
function outer() {
    return 1;
    /**
     * Computes a fallback value.
     */
    function helper() {
        return 2;
    }
}`.trim(),
            errors: [
                {
                    data: { name: "helper" },
                    messageId: "forbidden",
                },
            ],
            output: `
function outer() {
    /**
     * Computes a fallback value.
     */
    function helper() {
        return 2;
    }
    return 1;
}`.trim(),
        },
    ],
    valid: [
        // Function declaration before return — perfectly fine
        {
            code: `
function outer() {
    function helper() {}
    return helper();
}`.trim(),
        },
        // Arrow function after return is NOT flagged (not a FunctionDeclaration)
        {
            code: `
function outer() {
    return 1;
    const arrow = () => {};
}`.trim(),
        },
        // Function expression assigned to variable after return is NOT flagged
        {
            code: `
function outer() {
    return 1;
    const fn = function named() {};
}`.trim(),
        },
        // No return at all
        {
            code: `
function outer() {
    function helper() {}
    helper();
}`.trim(),
        },
        // Return inside switch-case: siblings is undefined for switch consequent
        {
            code: `
function outer(x) {
    switch (x) {
        case 1:
            return 1;
        default:
            return 0;
    }
    function helper() {}
}`.trim(),
        },
        // Top-level module scope: no issues when function comes before return
        {
            code: `
function helper() { return 1; }
export default function main() {
    return helper();
}`.trim(),
        },
        // Empty function body
        {
            code: "function empty() {}",
        },
        // Function declaration is the only statement
        {
            code: `
function outer() {
    function helper() {}
}`.trim(),
        },
        // Function declaration inside a nested block after return is ignored
        // because this rule only checks direct sibling statements.
        {
            code: `
function outer() {
    return 1;
    if (something) {
        function helper() {}
    }
}`.trim(),
        },
    ],
});
