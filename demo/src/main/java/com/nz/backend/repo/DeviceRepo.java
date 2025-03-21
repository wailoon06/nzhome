package com.nz.backend.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nz.backend.entities.Device;
import com.nz.backend.entities.Family;
import com.nz.backend.entities.Room;;

public interface DeviceRepo extends JpaRepository<Device, Long> {

     Device findByDeviceName(String device);

     Device findByDeviceNameAndFamily(String deviceName, Family family);

     List<Device> findByDeviceid(Long Deviceid);

     List<Device> findByFamilyFamilyName(String familyName);

     List<Device> findByFamilyFamilyid(Long Familyid);

     List<Device> findByFamily(Family family);

     List<Device> findByFamilyAndRoom(Family family, Room room);

     Optional<Device> findById(Long id); // Find device by ID

}
