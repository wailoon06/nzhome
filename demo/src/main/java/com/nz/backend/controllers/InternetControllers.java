package com.nz.backend.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nz.backend.entities.Internet;
import com.nz.backend.repo.InternetRepo;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class InternetControllers {

    @Autowired
    private InternetRepo internetRepo;
    
    @GetMapping("/internet")
    public ResponseEntity<?> internetUsage(@RequestHeader("Authorization") String token){
        if (token == null || token.isEmpty()){
            return ResponseEntity.badRequest().body("Invalid token!");
        }

        List<Internet> usageList = internetRepo.findAll();
        
        if (usageList.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        
        return ResponseEntity.ok(usageList);
    }

}

