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

    @Autowired
    private JwtToken jwtToken;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    @PostMapping("/register")
    public LoginResponse registerUser(@RequestBody RegisterDTO RegisterDTO) {
        // Check if email and name already exists
        if (usersRepository.existsByEmail(RegisterDTO.getEmail())) {
               throw new RuntimeException("Email already exists!");
        } else 
        if (usersRepository.existsByName(RegisterDTO.getName())) {
            throw new RuntimeException("Username already exists!");
        }

        // Hash the password
        String hashedPassword = passwordEncoder.encode(RegisterDTO.getPassword());

        // If there are no users in the database, the first user will be assigned the role of Admin, otherwise Basic
        LevelType userRole = usersRepository.count() == 0 ? LevelType.A : LevelType.B;
        
        // Create a new user
        Users user = new Users(
            RegisterDTO.getName(),
            RegisterDTO.getEmail(),
            hashedPassword,
            userRole                           
        );

        // Save the user to the database
        usersRepository.save(user); 

        // Generate a token
        String token = jwtToken.generateToken(user.getEmail(), userRole);

        // Return the token
        return new LoginResponse(token, user.getAccessLevel().name());
        
    }
}
