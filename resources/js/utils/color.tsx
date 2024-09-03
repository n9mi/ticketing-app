import { TicketPriority, TicketStatus } from "@/enums/ticket";

export const getTicketPriorityDefaultBgColor = (priority: string): string => {
    switch(priority) {
        case TicketPriority.HIGH:
            return "bg-red-800";
        case TicketPriority.NORMAL:
            return "bg-blue-800";
        default:
            return "";
    }
}

export const getTicketStatusDefaultBgColor = (status: string): string => {
    switch(status) {
        case TicketStatus.SUBMITTED:
            return "bg-slate-100";
        case TicketStatus.ON_HOLD:
            return "bg-slate-400";
        case TicketStatus.ON_PROGRESS:
            return "bg-yellow-200";
        case TicketStatus.FINISHED_BY_ADMIN:
            return "bg-green-400";
        case TicketStatus.FINISHED_BY_DIVISION:
            return "bg-green-400";
        case TicketStatus.ASSIGNED_TO_DIVISION:
            return "bg-blue-600";
        case TicketStatus.REVOKED_BY_USER:
            return "bg-orange-600";
        case TicketStatus.REJECTED:
            return "bg-red-600";
        default:
            return "";
    }
}
