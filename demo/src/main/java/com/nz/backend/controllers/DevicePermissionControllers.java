package com.nz.backend.controllers;

import java.util.List;
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
import com.nz.backend.entities.Device;
import com.nz.backend.entities.DevicePermission;
import com.nz.backend.entities.User;
import com.nz.backend.repo.DevicePermissionRepo;
import com.nz.backend.repo.DeviceRepo;
import com.nz.backend.repo.UserRepo;
import com.nz.backend.services.JwtService;

@RestController
@RequestMapping("/api")
public class DevicePermissionControllers {
    
    @Autowired
    private DevicePermissionRepo devicePermissionRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private DeviceRepo deviceRepo;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/grantDevicePermission") 
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
        if (users.isEmpty()) {
            return ResponseEntity.badRequest().body("No valid users found!");
        }

        Device device = deviceRepo.findById(grantDTO.getDeviceid())
        .orElseThrow(() -> new RuntimeException("Device not found!"));

        // Grant permission for each user
        for (User user : users) {
            if (!devicePermissionRepo.existsByUserAndDevice(user, device)) { 
                DevicePermission permission = new DevicePermission(user, device, owner);
                devicePermissionRepo.save(permission);
            }
        }

        return ResponseEntity.ok("Permission grantted successfully!");
    }

    @PostMapping("/validateDevicePermission")
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
        
        Device device = deviceRepo.findById(grantDTO.getDeviceid())
        .orElseThrow(() -> new RuntimeException("Device not found!"));
        
        DevicePermission permission = devicePermissionRepo.findByUserAndDevice(user, device);
        if (permission == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No permission found for this user in this device.");
        }
        
        return ResponseEntity.ok("");
    }

    @PostMapping("/getUserWithDevicePermission")
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
        
        Device device = deviceRepo.findById(grantDTO.getDeviceid())
        .orElseThrow(() -> new RuntimeException("Device not found!"));
        
        List<User> userListWithPermission = devicePermissionRepo.findByDevice(device)
                .stream()
                .map(DevicePermission::getUser) // Extract User from each Permission
                .collect(Collectors.toList());

        return ResponseEntity.ok(userListWithPermission);
    }

    @DeleteMapping("/deleteDevicePermission") 
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

        Device device = deviceRepo.findById(grantDTO.getDeviceid())
        .orElseThrow(() -> new RuntimeException("Device not found!"));

        // Grant permission for each user
        for (User user : users) {
            if (user.getRole().equals(owner.getRole())) {
                return ResponseEntity.badRequest().body("You are the owner!");
            }
            DevicePermission permission = devicePermissionRepo.findByUserAndDevice(user, device);
            devicePermissionRepo.delete(permission);
        }

        return ResponseEntity.ok("Permission deleted successfully!");
    }
}
