package com.nz.backend.controllers;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
import com.nz.backend.entities.Family;
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
    public ResponseEntity<?> getTotalEnergyFam(@RequestHeader("Authorization") String token) {

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

        // Get the user's family
        Family family = user.getFamily();

        // Find all energy data with the same family
        List<Energy> energyRecords = energyRepo.findByFamily(family);
        if (energyRecords.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyMap()); // No energy data
        }

        // For the energy records, if they have same deviceid, place the energy consumption and generation in the same json array
        // For example, the response will have [{deviceid: deviceid, familyid: familyid. {date: date, energyComsumption: energyConsumption}, (date:date, energyConsumption: energyConsumption)}]
        
        // Group energy records by deviceId
        Map<Long, Map<String, Object>> groupedEnergy = new HashMap<>();

        for (Energy energy : energyRecords) {
            Long deviceId = energy.getDevice().getDeviceid();

            // Create a new structure if the device is not in the map
            groupedEnergy.putIfAbsent(deviceId, new HashMap<>());
            Map<String, Object> deviceData = groupedEnergy.get(deviceId);

            // Set device and family details only once
            deviceData.put("deviceId", deviceId);
            deviceData.put("familyId", energy.getDevice().getFamily().getFamilyid());

            // Retrieve or initialize the list of energy records for this device
            List<Map<String, Object>> energyList = (List<Map<String, Object>>) deviceData.get("energyRecords");
            if (energyList == null) {
                energyList = new ArrayList<>();
                deviceData.put("energyRecords", energyList);
            }

            // Add energy consumption and generation data
            Map<String, Object> energyData = new HashMap<>();
            energyData.put("date", energy.getDate());
            energyData.put("energyConsumption", energy.getEnergyConsumption());
            energyData.put("energyGeneration", energy.getEnergyGeneration());

            energyList.add(energyData);
        }

        // Convert map values to a list for JSON serialization
        return ResponseEntity.ok(new ArrayList<>(groupedEnergy.values()));
    }
}
