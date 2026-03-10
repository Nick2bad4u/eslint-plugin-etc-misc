const dynamicKey = "dynamic";
const source = { x: 1 };

const getterExcluded = {
    get b() {
        return 2;
    },
    a: 1,
};
const numericKeyStopsCheck = { 1: "one", a: "a" };
const sortedObject = { a: 1, b: 2 };
const unsortedIdentifiers = { b: 1, a: 2 };
const unsortedLiteralKeys = { zeta: 1, alpha: 2 };
const withComputedStillUnsorted = { [dynamicKey]: 0, b: 2, a: 1 };
const withSpreadStillUnsorted = { ...source, b: 2, a: 1 };

export {
    getterExcluded,
    numericKeyStopsCheck,
    sortedObject,
    unsortedIdentifiers,
    unsortedLiteralKeys,
    withComputedStillUnsorted,
    withSpreadStillUnsorted,
};
