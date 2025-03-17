package com.nz.backend.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nz.backend.entities.SampleDevice;

public interface SampleDeviceRepo extends JpaRepository<SampleDevice, Long>{

}
