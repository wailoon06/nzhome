package com.nz.backend.controllers;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nz.backend.dto.SampleDeviceDTO;
import com.nz.backend.repo.SampleDeviceRepo;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class SampleDeviceControllers {

    @Autowired
    private SampleDeviceRepo sampleDeviceRepo;

    @GetMapping("/getSampleDevices")
    public ResponseEntity<?> getSampleDevices(@RequestHeader("Authorization") String token) {
        if (token == null){
            return ResponseEntity.badRequest().body("Invalid token!");
        }

        List<SampleDeviceDTO> sampleDevices = sampleDeviceRepo.findAll()
            .stream()
            .map(sampleDevice -> new SampleDeviceDTO(
                sampleDevice.getSampleName(),
                sampleDevice.getCategory().getCategoryName(),
                sampleDevice.getPicture()
            ))
            .collect(Collectors.toList());

        return ResponseEntity.ok(sampleDevices);
    }
}
