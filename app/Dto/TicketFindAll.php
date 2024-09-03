<?php

namespace App\Dto;

use Illuminate\Support\Str;

class TicketFindAll {
    private $userId;
    private $subject;
    private $categoryId;
    private $priority;
    private $status;
    private $dateFrom;
    private $dateTo;
    private $page;
    private $pageSize;
    private $sortBy;
    private $userName;

    public function __construct(
        $userId,
        $subject,
        $categoryId,
        $priority,
        $status,
        $dateForm,
        $dateTo,
        $sortBy,
        $userName,
        $page = 1,
        $pageSize = 10)
    {
        $this->userId = $userId;
        $this->subject = $subject;
        $this->categoryId = $categoryId;
        $this->priority = $priority != null ? Str::upper($priority) : null;
        $this->status = $status != null ? Str::upper($status) : null;
        $this->dateFrom = $dateForm;
        $this->dateTo = $dateTo;
        $this->sortBy = $sortBy;
        $this->userName = $userName;
        $this->page = $page;
        $this->pageSize = $pageSize;
    }

    public function getUserId()
    {
        return $this->userId;
    }

    public function getSubject()
    {
        return $this->subject;
    }

    public function getCategoryId()
    {
        return $this->categoryId;
    }

    public function getPriority()
    {
        return $this->priority;
    }

    public function getStatus()
    {
        return $this->status;
    }

    public function getDateFrom()
    {
        return $this->dateFrom;
    }

    public function getDateTo()
    {
        return $this->dateTo;
    }

    public function getSortBy()
    {
        return $this->sortBy;
    }

    public function getUserName()
    {
        return $this->userName;
    }

    public function getPage()
    {
        return $this->page;
    }

    public function getPageSize()
    {
        return $this->pageSize;
    }
}
