package com.nz.backend.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nz.backend.entities.Permission;
import com.nz.backend.entities.Room;
import com.nz.backend.entities.User;

public interface PermissionRepo extends JpaRepository<Permission, Long> {

    boolean existsByUserAndRoom(User user, Room room);

    Permission findByUserAndRoom(User user, Room room);

    List<Permission> findByRoom(Room room);
}
