package com.nz.backend.controllers;

import java.io.IOException;
import java.util.Base64;
import java.util.List;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.nz.backend.dto.AddRoomDTO;
import com.nz.backend.dto.RoomNameDTO;
import com.nz.backend.dto.UpdateRoomDTO;
import com.nz.backend.entities.Device;
import com.nz.backend.entities.Family;
import com.nz.backend.entities.Room;
import com.nz.backend.entities.User;
import com.nz.backend.repo.DeviceRepo;
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

    @Autowired
    private DeviceRepo deviceRepo;

    @Value("${jwt.secret.key}")
    private String secretKey;

    @PostMapping("/createRoom")
    public ResponseEntity<?> createRoom(@RequestHeader("Authorization") String token, @RequestBody AddRoomDTO addroomdto, @RequestParam("file") MultipartFile file) throws IOException{

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

        // Get image
        if (file.getSize() > 5 * 1024 * 1024) {
            return ResponseEntity.badRequest().body("File size should not exceed 5MB!");
        }
        String base64Image = Base64.getEncoder().encodeToString(file.getBytes());

        Family family = user.getFamily();

        Room newRoom = new Room(
            addroomdto.getRoomName(),
            user,
            family,
            base64Image
        );

        roomRepo.save(newRoom);

        return ResponseEntity.ok("Room successfully created!");
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

        // Match the room with the get room name and user's family id
        Room matchRoom = roomRepo.findByRoomNameAndFamily(roomnamedto.getRoomName(), user.getFamily());
        if (matchRoom == null) {
            return ResponseEntity.badRequest().body("Room not found in the family!");
        }

        List<Device> devices = deviceRepo.findByFamilyAndRoom(user.getFamily(), matchRoom);

        deviceRepo.deleteAll(devices);
        
        roomRepo.delete(matchRoom);

        return ResponseEntity.ok("Room deleted successfully!");
    }

    @PutMapping("/updateRoom")
    public ResponseEntity<?> updateRoom(@RequestHeader("Authorization") String token, @RequestBody UpdateRoomDTO updateroomdto){

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

        Room matchRoom = roomRepo.findByRoomNameAndFamily(updateroomdto.getOldName(), user.getFamily());
        if (matchRoom == null) {
            return ResponseEntity.badRequest().body("Room not found in the family!");
        }

        if (updateroomdto.getNewName() != null){
            matchRoom.setRoomName(updateroomdto.getNewName());
        }

        roomRepo.save(matchRoom);

        return ResponseEntity.ok("Room updated successfully!");
    }


}
