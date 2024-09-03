<?php

namespace App\Enums;

enum TicketStatus: string
{
    case SUBMITTED = "SUBMITTED";
    case ON_HOLD = "ON HOLD";
    case ON_PROGRESS = "ON PROGRESS";
    case FINISHED_BY_ADMIN = "FINISHED BY ADMIN";
    case FINISHED_BY_DIVISION = "FINISHED BY DIVISION";
    case ASSIGNED_TO_DIVISION = "ASSIGNED TO DIVISION";
    case REVOKED_BY_USER = "REVOKED BY USER";
    case REJECTED = "REJECTED";
}
