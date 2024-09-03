<?php

namespace App\Enums;

enum SortTicketBy: string {
    case UPDATED_DATE = "updated_date";
    case PRIORITY = "priority";
}
