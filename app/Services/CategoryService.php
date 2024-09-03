<?php

namespace App\Services;

use App\Repositories\CategoryRepository;

class CategoryService {
    protected $categoryRepository;

    public function __construct(CategoryRepository $categoryRepository) {
        $this->categoryRepository = $categoryRepository;
    }

    /**
     * Get all categories
     */
    public function findAll() {
        return $this->categoryRepository->findAll();
    }
}
