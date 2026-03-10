import packageDefault from "@scope/package";
export { namedBinding } from "./named";
export * from "../all";
void import("./dynamic");

class FixtureClass {}

const moduleName = "./computed";

void import(moduleName);
void packageDefault;
void FixtureClass;
