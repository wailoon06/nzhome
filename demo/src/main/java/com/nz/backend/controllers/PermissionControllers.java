package com.nz.backend.controllers;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nz.backend.dto.GrantDTO;
import com.nz.backend.entities.Permission;
import com.nz.backend.entities.Room;
import com.nz.backend.entities.User;
import com.nz.backend.repo.PermissionRepo;
import com.nz.backend.repo.RoomRepo;
import com.nz.backend.repo.UserRepo;
import com.nz.backend.services.JwtService;

@RestController
@RequestMapping("/api")
public class PermissionControllers {
    
    @Autowired
    private PermissionRepo permissionRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private RoomRepo roomRepo;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/grantPermission") 
    public ResponseEntity<?> grantPermission (@RequestHeader("Authorization") String token, @RequestBody GrantDTO grantDTO) {
        
        // Token Verification
        if (token == null) {
            return ResponseEntity.badRequest().body("Invalid token!");
        }

        String jwtToken = token.substring(7);
        String email = jwtService.extractEmail(jwtToken);

        // Find the user object
        User owner = userRepo.findByEmail(email);
        if (owner == null) {
            return ResponseEntity.badRequest().body("User not found!");
        }
        
        // Access denied for normal user
        if (owner.getRole().name().equals("User")) {
            return ResponseEntity.badRequest().body("Access Denied!");
        }

        List<User> users = userRepo.findAllById(grantDTO.getUserid());

        Room room = roomRepo.findById(grantDTO.getRoomid())
        .orElseThrow(() -> new RuntimeException("Room not found!"));

        // Grant permission for each user
        for (User user : users) {
            if (!permissionRepo.existsByUserAndRoom(user, room)) { 
                Permission permission = new Permission(user, room, owner);
                permissionRepo.save(permission);
            }
        }

        return ResponseEntity.ok("Permission grantted successfully!");
    }

    @PostMapping("/validatePermission")
    public ResponseEntity<?> validatePermission (@RequestHeader("Authorization") String token, @RequestBody GrantDTO grantDTO) {

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
        
        Room room = roomRepo.findById(grantDTO.getRoomid())
        .orElseThrow(() -> new RuntimeException("Room not found!"));
        
        Optional<Permission> permission = permissionRepo.findFirstByUserAndRoom(user, room);
        if (permission.isEmpty()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("No permission found for this user in this room.");
        }
        
        return ResponseEntity.ok("");
    }

    @PostMapping("/getUserWithPermission")
    public ResponseEntity<?> getUserWithPermission (@RequestHeader("Authorization") String token, @RequestBody GrantDTO grantDTO ) {

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
        
        Room room = roomRepo.findById(grantDTO.getRoomid())
        .orElseThrow(() -> new RuntimeException("Room not found!"));
        
        List<User> userListWithPermission = permissionRepo.findByRoom(room)
                .stream()
                .map(Permission::getUser) // Extract User from each Permission
                .collect(Collectors.toList());

        return ResponseEntity.ok(userListWithPermission);
    }

    @DeleteMapping("/deletePermission") 
    public ResponseEntity<?> deletePermission (@RequestHeader("Authorization") String token, @RequestBody GrantDTO grantDTO) {
        
        // Token Verification
        if (token == null) {
            return ResponseEntity.badRequest().body("Invalid token!");
        }

        String jwtToken = token.substring(7);
        String email = jwtService.extractEmail(jwtToken);

        // Find the user object
        User owner = userRepo.findByEmail(email);
        if (owner == null) {
            return ResponseEntity.badRequest().body("User not found!");
        }

        // Access denied for normal user
        if (owner.getRole().name().equals("User")) {
            return ResponseEntity.badRequest().body("Access Denied!");
        }

        List<User> users = userRepo.findAllById(grantDTO.getUserid());
        if (users.isEmpty()) {
            return ResponseEntity.badRequest().body("No valid users found!");
        }

        Room room = roomRepo.findById(grantDTO.getRoomid())
        .orElseThrow(() -> new RuntimeException("Room not found!"));

        // Grant permission for each user
        for (User user : users) {
            if (user.getRole().equals(owner.getRole())) {
                return ResponseEntity.badRequest().body("You are the owner!");
            }
            Optional<Permission> permissionOpt = permissionRepo.findFirstByUserAndRoom(user, room);
            if (permissionOpt.isPresent()) {
                permissionRepo.delete(permissionOpt.get());
            }
        }

        return ResponseEntity.ok("Permission deleted successfully!");
    }
}
