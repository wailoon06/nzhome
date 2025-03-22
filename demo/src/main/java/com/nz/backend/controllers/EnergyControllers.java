package com.nz.backend.controllers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nz.backend.dto.DeviceEnergyTotalDTO;
import com.nz.backend.dto.EnergyDTO;
import com.nz.backend.entities.Energy;
import com.nz.backend.entities.User;
import com.nz.backend.repo.DeviceRepo;
import com.nz.backend.repo.EnergyRepo;
import com.nz.backend.repo.UserRepo;
import com.nz.backend.services.JwtService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class EnergyControllers {

    @Autowired
    private DeviceRepo deviceRepo;

    @Autowired
    private UserRepo userRepo;

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
        .map(energy -> new EnergyDTO(
            energy.getEnergyId(),
            energy.getDate(),
            energy.getEnergyConsumption(),
            energy.getEnergyGeneration(),
            energy.getDevice().getDeviceid(),
            energy.getDevice().getDeviceName(),
            energy.getDevice().getRoom().getRoomName()
        ))
        .collect(Collectors.toList());

        return ResponseEntity.ok(energyDTOList);
    }

    @GetMapping("/getEnergyFam")
    public ResponseEntity<List<EnergyDTO>> getEnergyFam(@RequestHeader("Authorization") String token) {

        // Token Verification
        if (token == null) {
            return ResponseEntity.badRequest().body(null);
        }

        String jwtToken = token.substring(7);
        String email = jwtService.extractEmail(jwtToken);

        // Find the user object
        User user = userRepo.findByEmail(email);
        if (user == null) {
            return ResponseEntity.badRequest().body(null);
        }

        List<Energy> energyData = energyRepo.findByFamily(user.getFamily());
        if (energyData.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        List<EnergyDTO> energyDTOList = energyData.stream()
        .map(energy -> new EnergyDTO(
            energy.getEnergyId(),
            energy.getDate(),
            energy.getEnergyConsumption(),
            energy.getEnergyGeneration(),
            energy.getDevice().getDeviceid(),
            energy.getDevice().getDeviceName(),
            energy.getDevice().getRoom().getRoomName()
        ))
        .collect(Collectors.toList());

        return ResponseEntity.ok(energyDTOList);
    }
}
