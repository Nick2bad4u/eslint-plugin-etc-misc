# typescript/class-methods-use-this

Require non-static class methods to reference `this`.

## Rule Details

This rule reports class instance methods that do not use `this` and do not declare a `this` parameter.

### ❌ Incorrect

```ts
class C {
    method() {
        return 1;
    }
}
```

### ✅ Correct

```ts
class C {
    method() {
        return this;
    }
}
```

```ts
class C {
    method(this: void) {
        return 1;
    }
}
```

## Options

This rule has no options.

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/typescript/class-methods-use-this": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if methods that do not reference `this` are acceptable.
