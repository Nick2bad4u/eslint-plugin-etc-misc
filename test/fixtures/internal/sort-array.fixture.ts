const alpha = "alpha";
const externalValues = ["z"];

const alreadySorted = [
    "a",
    "b",
    "c",
];
// prettier-ignore
const leadingHole = [, "b", "a"];
const mixedWithIdentifier = [alpha, "a"];
const mixedWithSpread = [
    "b",
    ...externalValues,
    "a",
];
const numbersNeedSorting = [2, 1];
const stringsNeedSorting = [
    "b",
    "a",
    "c",
];
// prettier-ignore
const trailingHole = ["b", "a", ,];

export {
    alreadySorted,
    leadingHole,
    mixedWithIdentifier,
    mixedWithSpread,
    numbersNeedSorting,
    stringsNeedSorting,
    trailingHole,
};
