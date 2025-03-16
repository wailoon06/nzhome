package com.nz.backend.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nz.backend.entities.Category;

public interface CategoryRepo extends JpaRepository<Category, Long> {
    Category findByCategoryname(String categoryname);
}