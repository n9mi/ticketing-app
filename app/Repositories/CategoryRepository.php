<?php

namespace App\Repositories;

use App\Models\Category;

class CategoryRepository {
    protected $category;

    public function __construct(Category $category)
    {
        $this->category = $category;
    }

    /**
     * Get all categories
     */
    public function findAll()
    {
        return $this->category
            ->select('id', 'name')
            ->get();
    }

    /**
     * Check if exists
     */
    public function isExists(int $id)
    {
        return $this->category->where('id', $id)->exists();
    }
}
