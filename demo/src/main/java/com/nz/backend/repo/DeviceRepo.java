package com.nz.backend.repo;


import org.springframework.data.jpa.repository.JpaRepository;

import com.nz.backend.entities.Device;



public interface DeviceRepo extends JpaRepository <Device, Long> {
     Device findbyDeviceName (String device);
}
