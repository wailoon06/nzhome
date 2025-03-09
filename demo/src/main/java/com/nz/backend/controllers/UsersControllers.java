package com.nz.backend.controllers;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nz.backend.dto.LoginDTO;
import com.nz.backend.dto.RegisterDTO;
import com.nz.backend.entities.Role;
import com.nz.backend.entities.Users;
import com.nz.backend.repo.UsersRepository;
import com.nz.backend.services.JwtService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class UsersControllers {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterDTO registerDTO) {

        if (registerDTO.getUsername() == null || registerDTO.getEmail() == null || registerDTO.getPassword() == null) {
            return ResponseEntity.badRequest().body("All fields are required!");
        }

        if (usersRepository.existsByEmail(registerDTO.getEmail())) {
            return ResponseEntity.badRequest().body("Email already exists!");
        }

        if (usersRepository.existsByUsername(registerDTO.getUsername())) {
            return ResponseEntity.badRequest().body("Username already exists!");
        }
        
        Role userRole = usersRepository.count() == 0 ? Role.Admin : Role.User;
        
        // Create a new user
        Users user = new Users(
            registerDTO.getUsername(),
            registerDTO.getEmail(),
            passwordEncoder.encode(registerDTO.getPassword()),
            userRole,
            null         
        );

        // Save to database
        usersRepository.save(user);

        return ResponseEntity.ok("Successfully Registered");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {
        
        if (loginDTO.getEmail() == null || loginDTO.getPassword() == null) {
            return ResponseEntity.badRequest().body("Email and password are required");
        }

        Users user = usersRepository.findByEmail(loginDTO.getEmail());

        if (user == null || !passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body("Error: Wrong user or password");
        }

        String token = jwtService.generateToken(user.getEmail(), user.getRole().name());
        
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", Map.of(
            "id", user.getUserId(),
            "username", user.getUsername(),
            "email", user.getEmail(),
            "role", user.getRole().name()
        ));
        
        return ResponseEntity.ok(response);
    }
}
