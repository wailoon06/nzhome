package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class LoginController {

    @Autowired
    private UsersRepository usersRepository;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/login")
    public String loginUser(@RequestBody LoginDTO loginDTO) {
        try {
            // Check if user exists
            Users user = usersRepository.findByEmail(loginDTO.getEmail());
            
            if (user == null) {
                return "User not found!";
            }

            // Compare hashed password
            if (passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
                return "Login successful!";
            } else {
                return "Invalid credentials!";
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "An error occurred: " + e.getMessage();
        }
    }
}

