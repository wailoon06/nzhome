package com.nz.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nz.backend.dto.AddRoomDTO;
import com.nz.backend.dto.RoomNameDTO;
import com.nz.backend.dto.UpdateRoomDTO;
import com.nz.backend.entities.Family;
import com.nz.backend.entities.Room;
import com.nz.backend.entities.User;
import com.nz.backend.repo.RoomRepo;
import com.nz.backend.repo.UserRepo;
import com.nz.backend.services.JwtService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class RoomControllers {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private RoomRepo roomRepo;

    @Value("${jwt.secret.key}")
    private String secretKey;

    @PostMapping("/createRoom")
    public ResponseEntity<?> createRoom(@RequestHeader("Authorization") String token, @RequestBody AddRoomDTO addroomdto){

        // Token Verification
        if (token == null){
            return ResponseEntity.badRequest().body("Invalid token!");
        }

        String jwtToken = token.substring(7);
        String email = jwtService.extractEmail(jwtToken);

        // Find the user object
        User user = userRepo.findByEmail(email);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found!");
        }

        // Access denied for normal user
        if (user.getRole().name().equals("User")) {
            return ResponseEntity.badRequest().body("Access Denied!");
        }

        Family family = user.getFamily();

        Room newRoom = new Room(
            addroomdto.getRoomName(),
            user,
            family,
            addroomdto.getImage()
        );

        roomRepo.save(newRoom);

        return ResponseEntity.ok("Successfully Added!");
        
    }

    @DeleteMapping("/deleteRoom")
    public ResponseEntity<?> dltRoom(@RequestHeader("Authorization") String token, @RequestBody RoomNameDTO roomnamedto){

         // Token Verification
         if (token == null){
            return ResponseEntity.badRequest().body("Invalid token!");
        }

        String jwtToken = token.substring(7);
        String email = jwtService.extractEmail(jwtToken);

        // Find the user object
        User user = userRepo.findByEmail(email);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found!");
        }

        // Access denied for normal user
        if (user.getRole().name().equals("User")) {
            return ResponseEntity.badRequest().body("Access Denied!");
        }

        Room matchRoom = roomRepo.findByRoomNameAndFamilyName(roomnamedto.getRoomName(), user.getFamily());

        if (matchRoom != null) {
            return ResponseEntity.badRequest().body("Room not found in the family!");
        }

        roomRepo.delete(matchRoom);

        return ResponseEntity.ok("Room deleted successfully!");
    }

    @PutMapping("updateRoom")
    public ResponseEntity<?> updateRoom(@RequestHeader("Authorization") String token, @RequestBody RoomNameDTO roomnamedto, @RequestBody UpdateRoomDTO updateroomdto){

        // Token Verification
        if (token == null){
            return ResponseEntity.badRequest().body("Invalid token!");
        }

        String jwtToken = token.substring(7);
        String email = jwtService.extractEmail(jwtToken);

        // Find the user object
        User user = userRepo.findByEmail(email);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found!");
        }

        // Access denied for normal user
        if (user.getRole().name().equals("User")) {
            return ResponseEntity.badRequest().body("Access Denied!");
        }

        Room matchRoom = roomRepo.findByRoomNameAndFamilyName(roomnamedto.getRoomName(), user.getFamily());

        if (matchRoom == null) {
            return ResponseEntity.badRequest().body("Room not found in the family!");
        }

        if (updateroomdto.getRoomName() != null){
            matchRoom.setRoomName(updateroomdto.getRoomName());
        }

        if (updateroomdto.getImage() != null) {
            matchRoom.setPicture(updateroomdto.getImage());
        }

        roomRepo.save(matchRoom);

        return ResponseEntity.ok("Room updated successfully!");
    }


}
