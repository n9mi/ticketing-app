<?php

namespace App\Services;

use App\Dto\ActionFindAll;
use App\Repositories\ActionRepository;
use App\Repositories\TicketRepository;

class ActionService {
    protected $actionRepository;
    protected $ticketRepository;

    public function __construct(
        ActionRepository $actionRepository,
        TicketRepository $ticketRepository)
    {
        $this->actionRepository = $actionRepository;
        $this->ticketRepository = $ticketRepository;
    }

    public function findAll(ActionFindAll $dto, string $baseUrl)
    {
        if (!$this->ticketRepository->isExists($dto->getTicketId())) {
            abort(404);
        }

        $result = $this->actionRepository->findAll($dto);
        $links = [];
        if (strlen($baseUrl) > 0) {
            $actionsCount = $result["countAll"];
            $linksCount = (int) ceil($actionsCount / $dto->getPageSize());
            for ($i = 1; $i <= $linksCount; $i++) {
                $link = $baseUrl."?page=".$i;

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
            "data" => $result["data"]
        ];
    }
}
