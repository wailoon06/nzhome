package com.nz.backend.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nz.backend.entities.Brand;

public interface BrandRepo extends JpaRepository<Brand, Long> {
    
}