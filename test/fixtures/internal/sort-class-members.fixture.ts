class SortedMembers {
    a(): void {}
    b = 1;
    c(): void {}
}

class UnsortedIdentifierMembers {
    z(): void {}
    a(): void {}
}

class UnsortedLiteralMembers {
    zeta(): void {}
    alpha(): void {}
}

class SkippedMembers {
    [Symbol.iterator](): void {}
    #hidden = 1;
    a(): void {}
    b(): void {}
}

export {
    SkippedMembers,
    SortedMembers,
    UnsortedIdentifierMembers,
    UnsortedLiteralMembers,
};
