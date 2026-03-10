enum Status {
    Open = "open",
    Closed = "closed",
}

declare const statusValue: Status;

const comparisonRight = statusValue === "open";
const comparisonLeft = "closed" !== statusValue;

const maybeStatus: Status | undefined = statusValue;
const comparisonWithUndefined = maybeStatus == "open";

function returnsStatus(flag: boolean): Status {
    if (flag) {
        return "open";
    }

    return Status.Closed;
}

type StatusLiteralUnion = "open" | "closed";
type MixedUnion = "open" | 2;

const plainString = "open";
const plainStringComparison = plainString === "open";

void comparisonLeft;
void comparisonRight;
void comparisonWithUndefined;
void returnsStatus;
void plainStringComparison;
