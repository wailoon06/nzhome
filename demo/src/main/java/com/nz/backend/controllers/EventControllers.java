package com.nz.backend.controllers;

import com.nz.backend.entities.Device;
import com.nz.backend.entities.Event;
import com.nz.backend.entities.User;
import com.nz.backend.entities.Family;
import com.nz.backend.repo.EventRepo;
import com.nz.backend.repo.DeviceRepo;
import com.nz.backend.repo.UserRepo;
import com.nz.backend.dto.AddEventDTO;
import com.nz.backend.dto.EventNameDTO;
import com.nz.backend.enums.OnOff;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.nz.backend.services.JwtService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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

    @Autowired
    private DeviceRepo deviceRepo; // ✅ Inject DeviceRepo here

    @PostMapping("/addEvent")
    public ResponseEntity<?> addEvent(@RequestHeader("Authorization") String token,
            @RequestBody AddEventDTO addEventDTO) {
        // Token Verification
        if (token == null || !token.startsWith("Bearer ")) {
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
        System.err.println(addEventDTO.getDevices());
        List<Event> savedEvents = new ArrayList<>();
        for (Long deviceId : addEventDTO.getDevices()) {
            Device device = deviceRepo.findById(deviceId).orElse(null);
            if (device == null) {
                return ResponseEntity.badRequest().body("Invalid device ID: " + deviceId);
            }

            Event newEvent = new Event(
                    addEventDTO.getTitle(),
                    addEventDTO.getDescription(),
                    addEventDTO.getDate(),
                    addEventDTO.getOnOff(),
                    user,
                    family,
                    deviceId);

            savedEvents.add(eventRepo.save(newEvent));
        }

        return ResponseEntity.ok(savedEvents);
    }

    @GetMapping("/allEvent")
    public List<Event> getAllEvents() {
        return eventRepo.findAll();
    }

    @DeleteMapping("/deleteEvent")
    public ResponseEntity<?> deleteEvent(
            @RequestHeader("Authorization") String token,
            @RequestBody EventNameDTO eventNameDTO) {

        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token!");
        }

        String jwtToken = token.substring(7);
        String email = jwtService.extractEmail(jwtToken);

        User user = userRepo.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found!");
        }
        // Find the event by title
        Optional<Event> matchEvent = eventRepo.findByTitle(eventNameDTO.getTitle());
        if (matchEvent.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Event not found!");
        }
        Event event = matchEvent.get();

        eventRepo.delete(event);
        return ResponseEntity.ok("Event deleted successfully!");
    }

    @GetMapping("/getUserEvents")
    public ResponseEntity<?> getUserEvents(@RequestHeader("Authorization") String token) {
        // Token verification
        if (token == null || !token.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token!");
        }

        String jwtToken = token.substring(7);
        String email = jwtService.extractEmail(jwtToken);

        // Find user by email
        User user = userRepo.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found!");
        }

        // Fetch events created by this user
        List<Event> userEvents = eventRepo.findByCreatedBy(user);

        return ResponseEntity.ok(userEvents);
    }

}
