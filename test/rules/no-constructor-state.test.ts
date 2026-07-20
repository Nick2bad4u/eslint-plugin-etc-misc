import rule from "../../src/rules/no-constructor-state";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("no-constructor-state", rule, {
    invalid: [
        {
            code: "class Component { constructor() { this.state = { ready: false }; } }",
            errors: [
                {
                    messageId: "preferStateField",
                    suggestions: [
                        {
                            messageId: "moveStateToField",
                            output: "class Component { state = { ready: false }; constructor() {  } }",
                        },
                    ],
                },
            ],
            output: null,
        },
        {
            code: "class Component extends Base { constructor() { super(); this.state = []; } }",
            errors: [
                {
                    messageId: "preferStateField",
                    suggestions: [
                        {
                            messageId: "moveStateToField",
                            output: "class Component extends Base { state = []; constructor() { super();  } }",
                        },
                    ],
                },
            ],
            output: null,
        },
        {
            code: "class Component { constructor() { setup(); this.state = null; } }",
            errors: [{ messageId: "preferStateField" }],
        },
        {
            code: "class Component { existing = 1; constructor() { this.state = undefined; } }",
            errors: [{ messageId: "preferStateField" }],
        },
        {
            code: "class Component { constructor() { this.state = { [createKey()]: false }; } }",
            errors: [{ messageId: "preferStateField" }],
        },
        {
            code: "class Component { constructor(undefined) { this.state = undefined; } }",
            errors: [{ messageId: "preferStateField" }],
        },
        {
            code: "class Component { constructor(Infinity) { this.state = [Infinity]; } }",
            errors: [{ messageId: "preferStateField" }],
        },
        {
            code: "class Component { constructor(NaN) { this.state = { value: NaN }; } }",
            errors: [{ messageId: "preferStateField" }],
        },
        {
            code: "class Component { constructor() { this.state /* setter note */ = {}; } }",
            errors: [{ messageId: "preferStateField" }],
        },
    ],
    valid: [
        "class Component { state = {}; }",
        "class Component { constructor() { this.value = {}; } }",
        "class Component { constructor() { this.state = createState(); } }",
        "class Component { constructor() { this.state = { ...defaults }; } }",
        "class Component { constructor() { if (ready) this.state = {}; } }",
        "class Component { constructor() { this.state = [, 1]; } }",
    ],
});
