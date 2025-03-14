package com.nz.backend.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nz.backend.entities.User;

public interface UserRepo extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);

    User findByUsername (String username);
    User findByEmail(String email);

    List<User> findByFamilyFamilyid (Long familyid);
}   
