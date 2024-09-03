<?php

namespace App\Http\Controllers\Customer;

use App\Dto\ActionFindAll;
use App\Dto\TicketFindAll;
use App\Enums\TicketStatus;
use App\Enums\UpdateTicketAs;
use App\Http\Controllers\Controller;
use App\Services\ActionService;
use App\Services\CategoryService;
use App\Services\TicketService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TicketController extends Controller
{
    protected $ticketService;
    protected $categoryService;
    protected $actionService;

    public function __construct(
        TicketService $ticketService,
        CategoryService $categoryService,
        ActionService $actionService)
    {
        $this->ticketService = $ticketService;
        $this->categoryService = $categoryService;
        $this->actionService = $actionService;
    }

    /**
     * Display all the user tickets
     */
    public function index(Request $request)
    {
        $curUser = $request->user();
        $dto = new TicketFindAll(
            $curUser->id,
            $request->subject,
            $request->categoryId,
            $request->priority,
            $request->status,
            $request->dateFrom,
            $request->dateTo,
            null,
            null,
            $request->page);

        return inertia('Customer/MyTickets', [
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
            ]
        ]);
    }

    /**
     * Display ticket create page
     */
    public function create()
    {
        $categories = $this->categoryService->findAll();

        return inertia('Customer/CreateTicket', [
            'categories' => $categories
        ]);
    }

    /**
     * Create a ticket
     */
    public function store(Request $request)
    {
        $errors = $this->ticketService->store($request);
        if($errors != null) {
            return redirect()
                        ->back()
                        ->withErrors($errors);
        }

        return redirect()
                    ->route('customer.my-tickets')
                    ->with("success", "Your ticket it successfully created!");
    }

    /**
     * Display ticket edit page
     */
    public function edit(Request $request, string $id)
    {
        if (!Str::isUuid($id)) {
            abort(404);
        }

        $dto = new ActionFindAll($id, $request->page, 10);

        return inertia('Customer/EditTicket', [
            'response' => [
                'ticket' => $this->ticketService->findById($id),
                'categories' => $this->categoryService->findAll(),
                'actions' => $this->actionService->findAll($dto, $request->url())
            ]
        ]);
    }

    /**
     * Update the ticket
     */
    public function update(Request $request, string $id)
    {
        if (!Str::isUuid($id)) {
            abort(404);
        }

        $errors = $this->ticketService->update($id, $request, UpdateTicketAs::CUSTOMER);
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
                    ->route('customer.my-tickets')
                    ->with("success", "Your ticket is successfully updated!");
    }

    /**
     * Revoke a ticket by id
     */
    public function revoke(Request $request, string $id)
    {
        if (!Str::isUuid($id)) {
            abort(404);
        }

        if (!$request->user()->hasRole("customer")) {
            abort(403);
        }

        $errors = $this->ticketService->updateStatus($id, [
            "status" => TicketStatus::REVOKED_BY_USER,
            "user" => $request->user()
        ]);
        if($errors != null) {
            if (key_exists("flash_error", $errors)) {
                return redirect()
                        ->back()
                        ->with("error",
                            $errors["flash_error"]);
            }
        }

        return redirect()
                    ->route('customer.my-tickets')
                    ->with("success", "Your ticket it successfully revoked!");
    }
}
