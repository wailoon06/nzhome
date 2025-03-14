package com.nz.backend.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nz.backend.entities.Brand;
import com.nz.backend.entities.User;
import com.nz.backend.repo.BrandRepo;
import com.nz.backend.repo.UserRepo;
import com.nz.backend.services.JwtService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class BrandControllers {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepo usersRepository;

    @Autowired
    private BrandRepo brandRepo;
    
    @Value("${jwt.secret.key}")
    private String secretKey;

    @GetMapping("/getBrand")
    public ResponseEntity<?> getBrand(@RequestHeader("Authorization") String token) {
        if (token == null){
            ResponseEntity.badRequest().body("Invalid token!");
        }

        String jwtToken = token.substring(7);
        String email = jwtService.extractEmail(jwtToken);

        User user = usersRepository.findByEmail(email);
        if (user == null){
            ResponseEntity.badRequest().body("User not found!");
        }

        List<Brand> brands = brandRepo.findAll();

        List<Map<String, Object>> brandList = brands.stream().map(brand -> {
            Map<String, Object> response = new HashMap<>();
            response.put("brandName", brand.getBrandName());
            return response;
        }).toList();

        return ResponseEntity.ok(brandList);
    }

    // DaikinAC, SamsungAC
    // SonyTV, SamsungTV
    // Humidity Sensor, Temperature Sensor
}
