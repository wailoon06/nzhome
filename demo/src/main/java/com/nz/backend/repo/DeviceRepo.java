package com.nz.backend.repo;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nz.backend.entities.Device;
import com.nz.backend.entities.Family;



public interface DeviceRepo extends JpaRepository <Device, Long> {

     Device findByDeviceName (String device);

     List<Device> findByFamily(Family family);

}
