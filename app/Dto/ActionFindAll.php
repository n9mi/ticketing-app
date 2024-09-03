<?php

namespace App\Dto;

class ActionFindAll {
    private $ticketId;
    private $page;
    private $pageSize;

    public function __construct($ticketId, $page = 1, $pageSize = 10)
    {
        $this->ticketId = $ticketId;
        $this->page = $page;
        $this->pageSize = $pageSize;
    }

    public function getTicketId()
    {
        return $this->ticketId;
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
