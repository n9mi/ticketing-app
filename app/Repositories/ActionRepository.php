<?php

namespace App\Repositories;

use App\Dto\ActionFindAll;
use App\Models\Action;

class ActionRepository {
    protected $action;

    public function __construct(Action $action)
    {
        $this->action = $action;
    }

    /**
     * Find all actions
     */
    public function findAll(ActionFindAll $dto)
    {
        $offset = ($dto->getPage() - 1) * $dto->getPageSize();
        $q = $this->action
            ->select('actions.comment',
                        'actions.description',
                        'actions.created_at',
                        'users.name as user_name')
            ->where('actions.ticket_id', '=', $dto->getTicketId())
            ->join('users', 'users.id', '=', 'actions.user_id');

        $countAll = $q->count();
        $q = $q->skip($offset)->take($dto->getPageSize())->get();

        return [
            "data" => $q,
            "countAll" => $countAll
        ];
    }

    /**
     * Store an action
     */
    public function store(array $data)
    {
        $this->action->create($data);
    }
}
