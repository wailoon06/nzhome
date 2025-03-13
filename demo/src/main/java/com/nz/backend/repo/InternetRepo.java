package com.nz.backend.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nz.backend.entities.Internet;

public interface InternetRepo extends JpaRepository<Internet, Long> {

    List<Internet> findAll();
    
}
