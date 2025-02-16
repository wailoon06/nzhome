package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class RegisterController {

    @Autowired
    private UsersRepository usersRepository;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    @PostMapping("/register")
    public String registerUser(@RequestBody RegisterDTO RegisterDTO) {
        try {
            if (usersRepository.existsByEmail(RegisterDTO.getEmail())) {
                return "Email already exists!";
            } else 
            if (usersRepository.existsByName(RegisterDTO.getName())) {
                return "Username already exists!";
            }

            String hashedPassword = passwordEncoder.encode(RegisterDTO.getPassword());

            Users users = new Users(
                RegisterDTO.getName(),
                RegisterDTO.getEmail(),
                hashedPassword,
                LevelType.B                           // Default access level
            );

            usersRepository.save(users); // Insert only name, email, password
            return "User registered successfully!";
        } catch (Exception e) {
            e.printStackTrace(); // Print stack trace for debugging
            return "An error occurred: " + e.getMessage();
        }
    }
}
