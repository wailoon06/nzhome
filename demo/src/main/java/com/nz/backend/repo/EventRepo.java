package com.nz.backend.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.nz.backend.entities.Device;
import com.nz.backend.entities.Event;
import com.nz.backend.entities.Family;
import com.nz.backend.entities.User;
import java.util.List;
import java.util.Optional;

public interface EventRepo extends JpaRepository<Event, Long> {
    Event findByTitleAndFamily(String title, Family family);

    List<Event> findByCreatedBy(User user); // Fetch events created by a specific user

    @Query("SELECT e FROM Event e WHERE e.title = :title AND e.deviceid = :deviceId")
    Event findByTitleAndDeviceId(@Param("title") String title, @Param("deviceId") Long deviceId);

}
