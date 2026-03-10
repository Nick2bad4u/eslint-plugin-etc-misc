/** @internal */ export const PublicValue = 1;

/** @internal */ export function PublicFunction(): void {}

export class Container {
    /** @internal */
    field = 1;

    /** @internal */
    method(): void {}

    /** @internal */
    _safeField = 2;

    /** @internal */
    _safeMethod(): void {}
}

/** @internal */
export enum PublicEnum {
    MEMBER = 1,
}

export enum MixedEnum {
    /** @internal */
    MEMBER = 1,
}

export interface Shape {
    /** @internal */
    width: number;

    /** @internal */
    height(): number;

    /** @internal */
    _safeWidth: number;

    /** @internal */
    _safeHeight(): number;
}

/** @internal */
export type PublicType = string;

/** @internal */
export default function (): void {}
