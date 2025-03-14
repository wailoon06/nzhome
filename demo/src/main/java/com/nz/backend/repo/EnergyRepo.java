package com.nz.backend.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nz.backend.entities.Energy;

public interface EnergyRepo extends JpaRepository<Energy, Long>{

    List<Energy> findByDeviceDeviceid(Long Deviceid);

}
