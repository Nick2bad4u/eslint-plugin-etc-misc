import rule from "../../src/rules/typescript-prefer-named-tuple-members";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("typescript-prefer-named-tuple-members", rule, {
    invalid: [
        {
            code: "type RGB = [number, number, number];",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestPreferNamedTupleMembers",
                            output: "type RGB = [item1: number, item2: number, item3: number];",
                        },
                    ],
                },
            ],
            output: "type RGB = [item1: number, item2: number, item3: number];",
        },
        {
            code: "type Pair = [id: string, number?];",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestPreferNamedTupleMembers",
                            output: "type Pair = [id: string, item2?: number];",
                        },
                    ],
                },
            ],
            output: "type Pair = [id: string, item2?: number];",
        },
        {
            code: "type Params = [...string[]];",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestPreferNamedTupleMembers",
                            output: "type Params = [...item1: string[]];",
                        },
                    ],
                },
            ],
            output: "type Params = [...item1: string[]];",
        },
        {
            code: "type Mixed = [item1: string, number];",
            errors: [
                {
                    messageId: "forbidden",
                    suggestions: [
                        {
                            messageId: "suggestPreferNamedTupleMembers",
                            output: "type Mixed = [item1: string, item2: number];",
                        },
                    ],
                },
            ],
            output: "type Mixed = [item1: string, item2: number];",
        },
    ],
    valid: [
        {
            code: "type RGB = [red: number, green: number, blue: number];",
        },
        {
            code: "type Pair = [id: string, value?: number];",
        },
        {
            code: "type Params = [...rest: string[]];",
        },
        {
            code: "type Data = readonly [id: string, value: number];",
        },
    ],
});
