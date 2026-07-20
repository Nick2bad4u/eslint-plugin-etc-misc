import rule from "../../src/rules/no-constructor-bind";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("no-constructor-bind", rule, {
    invalid: [
        {
            code: "class Handler { constructor() { this.click = this.click.bind(this); } click() {} }",
            errors: [
                {
                    messageId: "preferArrowField",
                    suggestions: [
                        {
                            messageId: "convertToArrowField",
                            output: "class Handler { constructor() {  } click = () => {} }",
                        },
                    ],
                },
            ],
            output: null,
        },
        {
            code: "const Handler = class { constructor() { this.click = this.click.bind(this); } async click(value: string): Promise<void> { console.log(value); } };",
            errors: [
                {
                    messageId: "preferArrowField",
                    suggestions: [
                        {
                            messageId: "convertToArrowField",
                            output: "const Handler = class { constructor() {  } click = async (value: string): Promise<void> => { console.log(value); } };",
                        },
                    ],
                },
            ],
            output: null,
        },
        {
            code: "class Handler { constructor() { this.click = this.click.bind(this); } click() { super.click(); } }",
            errors: [{ messageId: "preferArrowField" }],
        },
        {
            code: "class Handler { constructor() { this.click = this.click.bind(this); } }",
            errors: [{ messageId: "preferArrowField" }],
        },
        {
            code: "class Handler { constructor() { this.click = this.click.bind(/* stable */ this); } click() {} }",
            errors: [{ messageId: "preferArrowField" }],
        },
    ],
    valid: [
        "declare class Handler { constructor(); }",
        "class Handler { click = () => {}; }",
        "class Handler { constructor() { this.click = this.click.bind(other); } click() {} }",
        "class Handler { constructor() { this.click = this.other.bind(this); } click() {} other() {} }",
        "class Handler { constructor() { this.click = click.bind(this); } click() {} }",
        "class Handler { constructor() { nested(() => { this.click = this.click.bind(this); }); } click() {} }",
        "class Handler { constructor() { this.click = this.click.bind(this, 1); } click() {} }",
    ],
});
