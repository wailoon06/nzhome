package com.nz.backend.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.nz.backend.entities.Event;

public interface EventRepo extends JpaRepository<Event, Long> {
}
