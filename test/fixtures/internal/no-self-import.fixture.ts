import value from "./module";
import typed from "./module.ts";
export { value } from "./module";
export * from "./module";
void import("./module");

void import(`./module`);
import other from "./other-module";

export { typed, value, other };
