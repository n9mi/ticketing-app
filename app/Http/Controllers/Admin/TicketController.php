<?php

namespace App\Http\Controllers\Admin;

use App\Dto\ActionFindAll;
use App\Dto\TicketFindAll;
use App\Enums\UpdateTicketAs;
use App\Http\Controllers\Controller;
use App\Services\ActionService;
use App\Services\CategoryService;
use App\Services\DivisionService;
use App\Services\TicketService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TicketController extends Controller
{
    protected $ticketService;
    protected $categoryService;
    protected $divisionService;
    protected $actionService;

    public function __construct(
        TicketService $ticketService,
        CategoryService $categoryService,
        DivisionService $divisionService,
        ActionService $actionService)
    {
        $this->ticketService = $ticketService;
        $this->categoryService = $categoryService;
        $this->divisionService = $divisionService;
        $this->actionService = $actionService;
    }

    /**
     * Display all tickets
     */
    public function index(Request $request) {
        $dto = new TicketFindAll(
            null,
            $request->subject,
            $request->categoryId,
            $request->priority,
            $request->status,
            $request->dateFrom,
            $request->dateTo,
            $request->sortBy,
            $request->userName,
            $request->page);
        return inertia('Admin/Tickets', [
            'response' => [
                'tickets' => $this->ticketService->findAll($dto, $request->url()),
                'categories' => $this->categoryService->findAll(),
            ],
            'params' => [
                "subject" => $dto->getSubject() != null ? $dto->getSubject() : "",
                "categoryId" => $dto->getCategoryId() != null ? $dto->getCategoryId() : "",
                "priority" => $dto->getPriority() != null ? $dto->getPriority() : "",
                "status" => $dto->getStatus() != null ? $dto->getStatus() : "",
                "dateFrom" => $dto->getDateFrom() != null ? $dto->getDateFrom() : "",
                "dateTo" => $dto->getDateTo() != null ? $dto->getDateTo() : "",
                "sortBy" => $dto->getSortBy() != null ? $dto->getSortBy() : "",
                "userName" => $dto->getUserName() != null ? $dto->getUserName() : "",
            ]
        ]);
    }

    /**
     * Displaying information for a ticket and show edit page
     */
    public function edit(Request $request, string $id)
    {
        if (!Str::isUuid($id)) {
            abort(404);
        }

        $dto = new ActionFindAll($id, $request->page, 10);

        return inertia('Admin/EditTicket', [
            'response' => [
                'ticket' => $this->ticketService->findById($id),
                'divisions' => $this->divisionService->findAll(),
                'actions' => $this->actionService->findAll($dto, $request->url()),
            ]
        ]);
    }

    /**
     * Updating ticket status
     */
    public function update(Request $request, string $id)
    {
        if (!Str::isUuid($id)) {
            abort(404);
        }

        $errors = $this->ticketService->update($id, $request, UpdateTicketAs::ADMIN);
        if($errors != null) {
            if (key_exists("flash_error", $errors)) {
                return redirect()
                        ->back()
                        ->with("error",
                            $errors["flash_error"]);
            }
            return redirect()
                        ->back()
                        ->withErrors($errors);
        }

        return redirect()
                    ->route('admin.tickets')
                    ->with("success", "Ticket is successfully updated!");
    }
}
