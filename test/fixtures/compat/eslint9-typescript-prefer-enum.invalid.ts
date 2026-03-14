enum Status {
    Open = "open",
    Closed = "closed",
}

declare const status: Status;

const isOpen = status === "open";

void isOpen;
