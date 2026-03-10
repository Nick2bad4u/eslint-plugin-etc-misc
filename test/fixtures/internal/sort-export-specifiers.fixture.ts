const alpha = 1;
const beta = 2;
const gamma = 3;

export { alpha, beta };
export { beta, alpha };
export { beta as b, alpha as a };
export { alpha as "alpha", beta as "zeta" };
export { beta as "zeta", alpha as "alpha" };
export * as namespaceExport from "./module";
export { gamma as g } from "./module";

export { namespaceExport };
