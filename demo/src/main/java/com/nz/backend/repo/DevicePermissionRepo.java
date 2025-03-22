package com.nz.backend.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nz.backend.entities.Device;
import com.nz.backend.entities.DevicePermission;
import com.nz.backend.entities.User;

public interface DevicePermissionRepo extends JpaRepository<DevicePermission, Long> {

    boolean existsByUserAndDevice(User user, Device device);

    DevicePermission findByUserAndDevice(User user, Device device);

    List<DevicePermission> findByDevice(Device device);
}
