package com.nz.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nz.backend.services.JwtService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class DeviceControllers {

    @Autowired
    private JwtService jwtService;

    @Value("${jwt.secret.key}")
    private String secretKey;

    @Value("${device.serial}")
    private String serialCode;

    @GetMapping("/getDeviceDetails")
    public ResponseEntity<?> getDeviceDetails() {
        return null;
    }

    @PostMapping("/addDeviceToRoom")
    public ResponseEntity<?> addDeviceToRoom() {
        return null;
    }

    @DeleteMapping("/deleteDeviceFromRoom")
    public ResponseEntity<?> dltDeviceFromRoom() {
        return null;
    }

    
}
