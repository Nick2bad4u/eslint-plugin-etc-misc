# no-use-extend-native

Disallow consuming non-native members on statically recognizable JavaScript
built-ins.

## Targeted pattern scope

This rule checks statically named member access on built-in constructors,
namespaces, prototypes, and expression forms whose native type is unambiguous.

## What this rule reports

The rule recognizes built-in constructors, namespaces, prototypes, literal
values, array/object/function expressions, callable built-in conversions, and
statically inferable binary-expression results. It reports:

- a statically named member absent from the built-in's native API;
- calling a native data property or accessor as a function; and
- using a prototype member as a static member, or a static member as an
  instance member.

Static computed strings are checked. Dynamic computed properties are ignored.
Shadowed global names and explicitly declared object-literal properties are
also ignored to prevent common false positives.

## Why this rule exists

Code that consumes monkey-patched native members has hidden runtime coupling
and fails when the patch is absent, reordered, or removed.

## ❌ Incorrect

```ts
"value".green;
[].customMethod();
new Float32Array().customMethod();
new Map().size();
String.toUpperCase();
"value".fromCharCode();
```

## ✅ Correct

```ts
"value".toUpperCase();
[].map(String);
new Float32Array().values();
new Map().size;
String.fromCharCode(65);

({ custom: true }).custom;

class Array {
 custom(): void {}
}
new Array().custom();
```

## Behavior and migration notes

Coverage includes the standard error constructors, arrays and typed arrays,
`ArrayBuffer`, `SharedArrayBuffer`, `DataView`, primitive wrappers,
collections, promises, regular expressions, weak collections/references, and
namespace objects such as `Atomics`, `Intl`, `JSON`, `Math`, and `Reflect` when
they exist in the lint runtime.

The rule reads property descriptors from the lint runtime. A runtime newer than
the deployment target can therefore recognize APIs unavailable in that target;
pair this rule with a compatibility rule when target-version enforcement is
required.

### Options and fixes

This rule has no options and no fixer. Replacing a non-native member requires
project-specific knowledge.

### Relationship to core `no-extend-native`

Core [`no-extend-native`](https://eslint.org/docs/latest/rules/no-extend-native)
prevents code from adding properties to native prototypes. This rule prevents
code from relying on those added properties. The rules are complementary.

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "no-extend-native": "error",
   "etc-misc/no-use-extend-native": "error",
  },
 },
];
```

## When not to use it

Disable the rule when the runtime intentionally guarantees specific prototype
patches, or when lint-runtime feature detection is not an acceptable API
baseline.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R068

## Further reading

### Upstream inspiration

Modernized from
[`eslint-plugin-no-use-extend-native`](https://github.com/dustinspecker/eslint-plugin-no-use-extend-native).

### Additional resources

- [MDN: inheritance and the prototype chain](https://developer.mozilla.org/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Review each finding against the configured JavaScript runtime baseline.
