package com.nz.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nz.backend.services.JwtService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class BrandControllers {

    @Autowired
    private JwtService jwtService;

    @Value("${jwt.secret.key}")
    private String secretKey;

    @GetMapping("/getBrand")
    public ResponseEntity<?> getBrand() {
        return null;
    }
    
}
