package com.nz.backend.controllers;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nz.backend.dto.EnergyDTO;
import com.nz.backend.entities.Energy;
import com.nz.backend.repo.DeviceRepo;
import com.nz.backend.repo.EnergyRepo;
import com.nz.backend.services.JwtService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class EnergyControllers {

    @Autowired
    private DeviceRepo deviceRepo;

    @Autowired
    private EnergyRepo energyRepo;

    @Autowired
    private JwtService jwtService;

    @GetMapping("/getEnergy")
    public ResponseEntity<List<EnergyDTO>> getEnergy(@RequestHeader("Authorization") String token, @RequestParam Long deviceid) {

        // Token Verification
        if (token == null) {
            return ResponseEntity.badRequest().body(null);
        }

        List<Energy> energyData = energyRepo.findByDeviceDeviceid(deviceid);
    
        if (energyData.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        List<EnergyDTO> energyDTOList = energyData.stream()
            .map(e -> new EnergyDTO(e.getEnergyId(), e.getDate(), e.getEnergyConsumption()))
            .collect(Collectors.toList());

        return ResponseEntity.ok(energyDTOList);
    }
}
