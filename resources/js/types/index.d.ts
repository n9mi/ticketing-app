export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
        roles: Role[];
    },
    flash: {
        message: string,
        success: string,
        error: string
    },
    query: Record<string, string>
}

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
}

export interface Role {
    id: string,
    display_name: string,
}

export interface PaginationLinkItem {
    link: string,
    isActive: boolean
}

export interface PaginationData<T> {
    links: PaginationLinkItem[]
    data: T
}

export interface Ticket {
    id: string,
    subject: string,
    priority: string,
    status: string,
    created_at: string,
    category: string
    user_name: string
}

export interface Category {
    id: number,
    name: string
}

export interface MyTicketsParams {
    subject: string,
    categoryId: string,
    priority: string,
    status: string,
    dateFrom: string,
    dateTo: string,
    sortBy: string,
    userName: string,
}

export interface MyTicketsResponse {
    tickets: PaginationData<Ticket[]>,
    categories: Category[]
}

export interface TicketDetail {
    id: string,
    subject: string,
    priority: string,
    status: string,
    description: string,
    created_at: string,
    updated_at: string,
    category_id: number,
    category_name: string,
    user_name: string
    division_id: string,
    division_display_name: string,
    comment: string,
}

export interface CustomerEditTicketResponse {
    ticket: TicketDetail,
    categories: Category[],
    actions: PaginationData<Action[]>
}

export interface Divison {
    id: string,
    display_name: string
}

export interface Action {
    comment: string,
    description: string,
    created_at: string,
    user_name: string
}

export interface AdminEditTicketResponse {
    ticket: TicketDetail,
    divisions: Divison[],
    actions: PaginationData<Action[]>
}
