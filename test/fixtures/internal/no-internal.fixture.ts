import { readFileSync as readFile } from "node:fs";

/** @internal */
interface InternalModel {
    readonly value: number;
}

/** @internal Fixture reason for internal API */
declare function internalFromFixture(): InternalModel;

const model: InternalModel = internalFromFixture();

void model;

export { readFile };
