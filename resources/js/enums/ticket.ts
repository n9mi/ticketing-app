export enum TicketPriority {
    HIGH = "HIGH",
    NORMAL = "NORMAL"
}

export enum TicketStatus {
    SUBMITTED = "SUBMITTED",
    ON_HOLD = "ON HOLD",
    ON_PROGRESS = "ON PROGRESS",
    FINISHED_BY_ADMIN = "FINISHED BY ADMIN",
    FINISHED_BY_DIVISION = "FINISHED BY DIVISION",
    ASSIGNED_TO_DIVISION = "ASSIGNED TO DIVISION",
    REVOKED_BY_USER = "REVOKED BY USER",
    REJECTED = "REJECTED"
}

export enum SortTicketBy {
    UPDATED_DATE = "updated_date",
    PRIORITY = "priority"
}
