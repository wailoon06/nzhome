package com.nz.backend.repo;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nz.backend.entities.Device;;



public interface DeviceRepo extends JpaRepository <Device, Long> {

     Device findByDeviceName (String device);

     List<Device> findByFamily(String family);

}
