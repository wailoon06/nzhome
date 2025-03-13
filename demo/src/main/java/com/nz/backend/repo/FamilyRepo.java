package com.nz.backend.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nz.backend.entities.Family;

public interface FamilyRepo extends JpaRepository<Family, Long> {
    boolean existsByFamilyName(String FamilyName);

}
