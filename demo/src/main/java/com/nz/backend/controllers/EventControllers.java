package com.nz.backend.controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nz.backend.dto.AddEventDTO;
import com.nz.backend.dto.EventDTO;
import com.nz.backend.dto.EventNameDTO;
import com.nz.backend.entities.Device;
import com.nz.backend.entities.Event;
import com.nz.backend.entities.Family;
import com.nz.backend.entities.User;
import com.nz.backend.enums.OnOff;
import com.nz.backend.repo.DeviceRepo;
import com.nz.backend.repo.EventRepo;
import com.nz.backend.repo.UserRepo;
import com.nz.backend.services.JwtService;

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

        List<Event> savedEvents = new ArrayList<>();
        for (Long deviceId : addEventDTO.getDevices()) {
            Device device = deviceRepo.findById(deviceId).orElse(null);
            if (device == null) {
                return ResponseEntity.badRequest().body("Invalid device ID: " + deviceId);
            }

            // Added
            device.setOnOff("On".equals(addEventDTO.getOnOff()) ? OnOff.On : OnOff.Off);
            deviceRepo.save(device);
            System.out.println(addEventDTO.getTitle());
            System.out.println(addEventDTO.getDescription());
            System.out.println(addEventDTO.getDate());
            System.out.println(user);
            System.out.println(addEventDTO.getOnOff());
            System.out.println(family);
            System.out.println(deviceId);

            Event newEvent = new Event(
                    addEventDTO.getTitle(),
                    addEventDTO.getDescription(),
                    addEventDTO.getDate(),
                    ("On".equals(addEventDTO.getOnOff()) ? OnOff.On : OnOff.Off), /* Main change */
                    user,
                    family,
                    deviceId);

            savedEvents.add(eventRepo.save(newEvent));
        }

        return ResponseEntity.ok(savedEvents);
    }

    @GetMapping("/allEvent")
    public ResponseEntity<?> getAllEvents(@RequestHeader("Authorization") String token) {
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

        // Fetch events with device name
        List<EventDTO> events = eventRepo.findAllWithDeviceNameByUser(user);
        return ResponseEntity.ok(events);
    }

    @DeleteMapping("/deleteEvent")
    public ResponseEntity<?> deleteEvent(
            @RequestHeader("Authorization") String token,
            @RequestParam String title) { // ✅ Extract title from query parameter

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
        Optional<Event> matchEvent = eventRepo.findByTitle(title);
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

        // Fetch events as EventDTO
        List<EventDTO> userEvents = eventRepo.findAllWithDeviceNameByUser(user);

        return ResponseEntity.ok(userEvents);
    }

}
