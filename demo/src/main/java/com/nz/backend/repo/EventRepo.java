package com.nz.backend.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.nz.backend.entities.Event;
import com.nz.backend.entities.Family;
import com.nz.backend.entities.User;

public interface EventRepo extends JpaRepository<Event, Long> {
    Event findByTitleAndFamily(String title, Family family);

    List<Event> findByCreatedBy(User user); // Fetch events created by a specific user

    @Query("SELECT e FROM Event e WHERE e.title = :title")
    Event findByTitle(@Param("title") String title);

}
