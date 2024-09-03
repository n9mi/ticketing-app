<?php

namespace App\Repositories;

use App\Dto\TicketFindAll;
use App\Enums\SortTicketBy;
use App\Models\Ticket;

class TicketRepository {
    protected $ticket;

    public function __construct(Ticket $ticket)
    {
        $this->ticket = $ticket;
    }

    /**
     * Get all tickets
     */
    public function findAll(TicketFindAll $dto)
    {
        $q = $this->ticket
                ->select('tickets.id',
                    'tickets.subject',
                    'tickets.priority',
                    'tickets.status',
                    'tickets.created_at',
                    'users.name as user_name',
                    'categories.name as category');

        if ($dto->getUserId() != null) {
            $q = $q->where('tickets.user_id', '=', $dto->getUserId());
        }

        if ($dto->getSubject() != null) {
            $q = $q->where('tickets.subject', 'ilike', '%'.$dto->getSubject().'%');
        }

        if ($dto->getCategoryId() != null) {
            $q = $q->where('categories.id', '=', $dto->getCategoryId());
        }

        if ($dto->getPriority() != null) {
            $q = $q->where('tickets.priority', '=', $dto->getPriority());
        }

        if ($dto->getStatus() != null) {
            $q = $q->where('tickets.status', '=', $dto->getStatus());
        }

        if ($dto->getDateFrom() != null && $dto->getDateTo() != null) {
            if ($dto->getDateFrom() == $dto->getDateTo()) {
                $q = $q->whereDate('tickets.created_at', '=', $dto->getDateFrom());
            } else {
                $q = $q->whereBetween('tickets.created_at', [ $dto->getDateFrom(), $dto->getDateTo() ]);
            }
        }

        if ($dto->getUserName() != null) {
            $q = $q->where('users.name', 'ilike', '%'.$dto->getUserName().'%');
        }

        $offset = ($dto->getPage() - 1) * $dto->getPageSize();
        $q = $q->join('categories', 'categories.id', '=', 'tickets.category_id')
                ->join('users', 'users.id', '=', 'tickets.user_id');

        if ($dto->getSortBy() == SortTicketBy::PRIORITY->value) {
            $q = $q->orderBy('tickets.priority', 'ASC');
        }
        $q = $q->latest('tickets.updated_at');

        $countAll = $q->count();
        $q = $q->skip($offset)->take($dto->getPageSize())->get();

        return [
            "data" => $q,
            "countAll" => $countAll
        ];
    }

    /**
     * Check if ticket is exists
     */
    public function isExists(string $id)
    {
        return $this->ticket
                    ->where('id', '=', $id)
                    ->exists();
    }

    /**
     * Store a ticket
     */
    public function store(array $data)
    {
        return $this->ticket->create($data);
    }

    /**
     * Find a ticket by id
     */
    public function findById(string $id)
    {
        return $this->ticket
                        ->where('tickets.id', '=', $id)
                        ->select('tickets.id',
                            'tickets.subject',
                            'tickets.priority',
                            'tickets.status',
                            'tickets.description',
                            'tickets.created_at',
                            'tickets.updated_at',
                            'tickets.updated_at',
                            'tickets.category_id',
                            'tickets.division_id',
                            'categories.name as category_name',
                            'users.name as user_name',
                            'divisions.display_name as division_display_name',
                            'tickets.comment')
                        ->join('categories', 'categories.id', '=', 'tickets.category_id')
                        ->join('users', 'users.id', '=', 'tickets.user_id')
                        ->leftJoin('divisions', 'divisions.id', '=', 'tickets.division_id')
                        ->first();
    }

    /**
     * Update a ticket by id
     */
    public function update(string $id, array $data)
    {
        $this->ticket
                    ->where('id', '=', $id)
                    ->update($data);
    }
}
