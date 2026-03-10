const sideEffect = (..._args: readonly unknown[]): void => {};

function allowedFirstStatement(value: number): void {
    value += 1;
    sideEffect(value);
}

function disallowedAfterIf(value: number): void {
    if (value > 0) {
        sideEffect(value);
    }

    value += 1;
}

const disallowedArrow = (value: number): void => {
    sideEffect(value);
    value++;
};

function memberMutation(value: { count: number }): void {
    sideEffect(value);
    value.count += 1;
    value.count++;
}

function localMutation(value: number): number {
    let copy = value;
    sideEffect(copy);
    copy += 1;

    return copy;
}

export {
    allowedFirstStatement,
    disallowedAfterIf,
    disallowedArrow,
    localMutation,
    memberMutation,
};
