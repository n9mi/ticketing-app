<?php

namespace App\Repositories;

use App\Models\Division;

class DivisionRepository {
    protected $division;

    public function __construct(Division $division)
    {
        $this->division = $division;
    }

    public function findAll()
    {
        return $this->division
            ->select('id', 'display_name')
            ->get();
    }

    public function isExists(string $id)
    {
        return $this->division
            ->where('id', $id)
            ->exists();
    }

    public function findById(string $id)
    {
        return $this->division
            ->select('id', 'display_name')
            ->where('id', '=', $id)
            ->first();
    }
}
