<?php

namespace App\Services;

use App\Repositories\DivisionRepository;

class DivisionService {
    protected $divisionRepository;

    public function __construct(DivisionRepository $divisionRepository)
    {
        $this->divisionRepository = $divisionRepository;
    }

    public function findAll()
    {
        return $this->divisionRepository->findAll();
    }
}
