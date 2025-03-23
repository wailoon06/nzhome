package com.nz.backend.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.nz.backend.entities.Event;
import com.nz.backend.entities.Family;
import com.nz.backend.entities.User;
import com.nz.backend.dto.EventDTO;

public interface EventRepo extends JpaRepository<Event, Long> {
    Event findByTitleAndFamily(String title, Family family);

    List<Event> findByCreatedBy(User user); // Fetch events created by a specific user

    Optional<Event> findByTitle(String title);

    @Query("SELECT new com.nz.backend.dto.EventDTO(e.eventId, e.title, e.description, e.date, e.onOff, " +
            "e.createdBy, e.family, e.deviceid, d.deviceName) " +
            "FROM Event e LEFT JOIN Device d ON e.deviceid = d.deviceid " +
            "WHERE e.createdBy = :user")
    List<EventDTO> findAllWithDeviceNameByUser(@Param("user") User user);

}
