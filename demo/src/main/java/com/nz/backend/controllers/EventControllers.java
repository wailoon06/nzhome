package com.nz.backend.controllers;

import java.util.HashMap;
import java.util.Map;

import com.nz.backend.entities.Device;
import com.nz.backend.entities.Event;
import com.nz.backend.entities.User;
import com.nz.backend.entities.Family;
import com.nz.backend.enums.OnOff;
import com.nz.backend.repo.EventRepo;
import com.nz.backend.repo.UserRepo;

import com.nz.backend.dto.AddEventDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.nz.backend.services.JwtService;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class EventControllers {

    @Autowired
    private EventRepo eventRepo;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepo userRepo;

    @PostMapping("/addEvent")
    public ResponseEntity<?> addEvent(@RequestHeader("Authorization") String token,
            @RequestBody AddEventDTO addEventDTO) {
        // Token Verification
        if (token == null) {
            return ResponseEntity.badRequest().body("Invalid token!");
        }

        String jwtToken = token.substring(7);
        String email = jwtService.extractEmail(jwtToken);

        // Find the user object
        User user = userRepo.findByEmail(email);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found!");
        }
        Family family = user.getFamily();

        Event newEvent = new Event(
                addEventDTO.getTitle(),
                addEventDTO.getDescription(),
                addEventDTO.getDate(),
                addEventDTO.isRepeat(), //
                user,
                family,
                addEventDTO.getDevices());
        eventRepo.save(newEvent);
        return ResponseEntity.ok("Successfully Added!");
    }

    @GetMapping("/allEvent")
    public List<Event> getAllEvents() {
        return eventRepo.findAll();
    }
}
