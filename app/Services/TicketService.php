<?php

namespace App\Services;

use App\Dto\TicketFindAll;
use App\Enums\SortTicketBy;
use App\Enums\TicketPriority;
use App\Enums\TicketStatus;
use App\Enums\UpdateTicketAs;
use App\Repositories\ActionRepository;
use App\Repositories\CategoryRepository;
use App\Repositories\DivisionRepository;
use App\Repositories\TicketRepository;
use Illuminate\Http\Request;
use ValueError;

class TicketService {
    protected $ticketRepository;
    protected $categoryRepository;
    protected $divisionRepository;
    protected $actionRepository;

    public function __construct(
        TicketRepository $ticketRepository,
        CategoryRepository $categoryRepository,
        DivisionRepository $divisionRepository,
        ActionRepository $actionRepository)
    {
        $this->ticketRepository = $ticketRepository;
        $this->categoryRepository = $categoryRepository;
        $this->divisionRepository = $divisionRepository;
        $this->actionRepository = $actionRepository;
    }

    /**
     * Get all tickets
     */
    public function findAll(TicketFindAll $dto, string $baseUrl)
    {
        $result = $this->ticketRepository->findAll($dto);
        $links = [];
        if (strlen($baseUrl) > 0) {
            $ticketsCount = $result["countAll"];
            $linksCount = (int) ceil($ticketsCount / $dto->getPageSize());
            for ($i = 1; $i <= $linksCount; $i++) {
                $link = $baseUrl."?categoryId=".($dto->getCategoryId() != null ? $dto->getCategoryId() : "");
                $link = $link."&dateFrom=".($dto->getDateFrom() != null ? $dto->getDateFrom() : "");
                $link = $link."&dateTo=".($dto->getDateTo() != null ? $dto->getDateTo() : "");
                if ($dto->getUserId() == null && ($dto->getSortBy() == SortTicketBy::UPDATED_DATE->value
                    || $dto->getSortBy() == SortTicketBy::PRIORITY->value)) {
                    $link = $link."&sortBy=".($dto->getSortBy() != null ? $dto->getSortBy() : "");
                }
                $link = $link."&page=".$i;
                $link = $link."&priority=".($dto->getPriority() != null ? $dto->getPriority() : "");
                $link = $link."&status=".($dto->getStatus() != null ? $dto->getStatus() : "");
                $link = $link."&subject=".($dto->getSubject() != null ? $dto->getSubject() : "");
                if ($dto->getUserId() == null && $dto->getUserName() != null) {
                    $link = $link."&userName=".($dto->getUserName() != null ? $dto->getUserName() : "");
                }

                array_push($links, [
                    "link" => $link,
                    "isActive" => $dto->getPage() == $i
                ]);
            }
            if ($dto->getPage() == null && count($links) > 0) {
                $links[0]["isActive"] = true;
            }
        }

        return [
            "links" => $links,
            "data" => $result["data"],
        ];
    }

    /**
     * Store a ticket
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            "category_id" => "required",
            "subject" => "required",
            "description" => "required"
        ]);
        if (!$this->categoryRepository->isExists($request->category_id)) {
            return [
                "category" => "category doesn't exists"
            ];
        }

        $newTicket = $this->ticketRepository->store([
            ...$validated,
            "priority" => TicketPriority::NORMAL,
            "status" => TicketStatus::SUBMITTED,
            "user_id" => $request->user()->id,
        ]);

        $this->actionRepository->store([
            'ticket_id' => $newTicket->id,
            'user_id' => $request->user()->id,
            'description' => "user ".$request->user()->name." submitted a ticket",
            'assigned_priority' => TicketPriority::NORMAL,
            'assigned_status' => TicketStatus::SUBMITTED
        ]);
    }

    /**
     * Find ticket by id
     */
    public function findById(string $id)
    {
        $ticket = $this->ticketRepository->findById($id);
        if ($ticket == null) {
            abort(404);
        }

        return $ticket;
    }

    /**
     * Update the ticket by id
     */
    public function update(string $id, Request $request, UpdateTicketAs $as)
    {
        $ticket = $this->ticketRepository->findById($id);
        if ($ticket == null) {
            abort(404);
        }
        $validated = [];

        switch ($as) {
            case UpdateTicketAs::ADMIN :
                $validated = $request->validate([
                    "priority" => "required",
                    "status" => "required",
                ]);

                try {
                    TicketPriority::from($validated["priority"]);
                } catch (ValueError $e) {
                    return [
                        "priority" => "invalid priority"
                    ];
                }

                try {
                    TicketStatus::from($validated["status"]);
                } catch (ValueError $e) {
                    return [
                        "status" => "invalid status"
                    ];
                }

                $toDivision = null;
                if ($validated["status"] == TicketStatus::ASSIGNED_TO_DIVISION->value) {
                    if ($request->division == null || $request->division == "") {
                        return [
                            "division" => "must assign to division if you change the status to 'Assigned to division'"
                        ];
                    }
                    if (!$this->divisionRepository->isExists($request->division)) {
                        return [
                            "division" => "division not found"
                        ];
                    }
                    $toDivision = $request->division;
                }

                $validated["division_id"] = $toDivision;
                $validated["comment"] = $request->comment;

                $actionDesc = "";
                $descPref = "admin ".$request->user()->name." changes ";
                if ($ticket->priority != $validated["priority"]) {
                    $actionDesc = $actionDesc.$descPref." priority from ".$ticket->priority." to ".$validated["priority"].". ";
                }
                if ($ticket->status != $validated["status"]) {
                    $actionDesc = $actionDesc.$descPref." ticket status from ".$ticket->status." to ".$validated["status"].". ";
                }
                if ($ticket->division_id != $validated["division_id"] && $validated["division_id"] != null) {
                    $division = $this->divisionRepository->findById($validated["division_id"]);
                    $actionDesc = $actionDesc.$descPref." assigned the ticket to division ".$division->display_name.".";
                }

                $this->actionRepository->store([
                    'ticket_id' => $ticket->id,
                    'user_id' => $request->user()->id,
                    'comment' => $validated["comment"],
                    'description' => $actionDesc,
                    'assigned_priority' => $validated["priority"],
                    'assigned_status' => $validated["status"]
                ]);
                break;
            case UpdateTicketAs::CUSTOMER :
                if ($ticket->status != TicketStatus::SUBMITTED->value) {
                    return [
                        "flash_error" => "Processed ticket can't be edited!"
                    ];
                }

                $validated = $request->validate([
                    "category_id" => "required",
                    "subject" => "required",
                    "description" => "required"
                ]);
                if (!$this->categoryRepository->isExists($request->category_id)) {
                    return [
                        "category" => "category doesn't exists"
                    ];
                }

                $this->actionRepository->store([
                    'ticket_id' => $ticket->id,
                    'user_id' => $request->user()->id,
                    'description' => "customer ".$request->user()->name." edited the ticket",
                ]);
                break;
            case UpdateTicketAs::DIVISION :
                break;
        }

        $this->ticketRepository->update($id, $validated);
    }

    /**
     * Update the ticket status by id
     */
    public function updateStatus(string $id, array $request)
    {
        $ticket = $this->ticketRepository->findById($id);
        if ($ticket == null) {
            abort(404);
        }

        if ($request["status"] == TicketStatus::REVOKED_BY_USER) {
            if (in_array($ticket->status, [
                TicketStatus::FINISHED_BY_ADMIN,
                TicketStatus::FINISHED_BY_DIVISION,
                TicketStatus::REVOKED_BY_USER,
                TicketStatus::REJECTED
            ])) {
                return [
                    "flash_error" => "Can't revoke finished ticket!"
                ];
            }
        }

        $this->ticketRepository->update($id, [ "status" => $request["status"] ]);
    }
}
