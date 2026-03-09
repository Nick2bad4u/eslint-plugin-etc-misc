import rule from "../../src/rules/no-implicit-any-catch";
import { ruleTester } from "../_internal/ruleTester";

ruleTester.run("no-implicit-any-catch", rule, {
    invalid: [
        {
            code: 'Promise.reject(new Error("Boom")).catch((error) => console.error(error));',
            errors: [
                {
                    messageId: "implicitAny",
                    suggestions: [
                        {
                            messageId: "suggestExplicitUnknown",
                            output: 'Promise.reject(new Error("Boom")).catch((error: unknown) => console.error(error));',
                        },
                    ],
                },
            ],
            output: 'Promise.reject(new Error("Boom")).catch((error: unknown) => console.error(error));',
        },
        {
            code: 'Promise.reject(new Error("Boom")).catch(error => console.error(error));',
            errors: [
                {
                    messageId: "implicitAny",
                    suggestions: [
                        {
                            messageId: "suggestExplicitUnknown",
                            output: 'Promise.reject(new Error("Boom")).catch((error: unknown) => console.error(error));',
                        },
                    ],
                },
            ],
            output: 'Promise.reject(new Error("Boom")).catch((error: unknown) => console.error(error));',
        },
        {
            code: 'Promise.reject(new Error("Boom")).catch((error: any) => console.error(error));',
            errors: [
                {
                    messageId: "explicitAny",
                    suggestions: [
                        {
                            messageId: "suggestExplicitUnknown",
                            output: 'Promise.reject(new Error("Boom")).catch((error: unknown) => console.error(error));',
                        },
                    ],
                },
            ],
            output: 'Promise.reject(new Error("Boom")).catch((error: unknown) => console.error(error));',
        },
        {
            code: 'Promise.reject(new Error("Boom")).catch((error: string) => console.error(error));',
            errors: [
                {
                    messageId: "narrowed",
                    suggestions: [
                        {
                            messageId: "suggestExplicitUnknown",
                            output: 'Promise.reject(new Error("Boom")).catch((error: unknown) => console.error(error));',
                        },
                    ],
                },
            ],
        },
        {
            code: 'Promise.reject(new Error("Boom")).then(() => undefined, (error) => console.error(error));',
            errors: [
                {
                    messageId: "implicitAny",
                    suggestions: [
                        {
                            messageId: "suggestExplicitUnknown",
                            output: 'Promise.reject(new Error("Boom")).then(() => undefined, (error: unknown) => console.error(error));',
                        },
                    ],
                },
            ],
            output: 'Promise.reject(new Error("Boom")).then(() => undefined, (error: unknown) => console.error(error));',
        },
        {
            code: 'Promise.reject(new Error("Boom")).then(() => undefined, (error: any) => console.error(error));',
            errors: [
                {
                    messageId: "explicitAny",
                    suggestions: [
                        {
                            messageId: "suggestExplicitUnknown",
                            output: 'Promise.reject(new Error("Boom")).then(() => undefined, (error: unknown) => console.error(error));',
                        },
                    ],
                },
            ],
            options: [{ allowExplicitAny: false }],
            output: 'Promise.reject(new Error("Boom")).then(() => undefined, (error: unknown) => console.error(error));',
        },
    ],
    valid: [
        {
            code: 'Promise.reject(new Error("Boom")).catch(() => console.error("ignored"));',
        },
        {
            code: 'Promise.reject(new Error("Boom")).catch((error: unknown) => console.error(error));',
        },
        {
            code: 'Promise.reject(new Error("Boom")).catch((error: any) => console.error(error));',
            options: [{ allowExplicitAny: true }],
        },
        {
            code: 'Promise.reject(new Error("Boom")).then((value) => value, (error: unknown) => console.error(error));',
        },
        {
            code: 'const maybePromise = { catch(handler: (error: any) => void) { handler("value"); } }; maybePromise.catch((error: any) => console.error(error));',
        },
    ],
});
