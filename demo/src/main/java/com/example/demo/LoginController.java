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

    @Autowired
    private JwtToken jwtToken;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/login")
    public LoginResponse loginUser(@RequestBody LoginDTO loginDTO) {
        // Check if the user exists
        Users user = usersRepository.findByEmail(loginDTO.getEmail());
        
        //  Check if the user exists and if the password is correct
        if (user == null || !passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password!");   // Return a 401 status code if the user does not exist or the password is incorrect
        }

        //  Cretae a JWT token
        String token = jwtToken.generateToken(user.getEmail(), user.getAccessLevel());

        //  Return the token
        return new LoginResponse(token, user.getAccessLevel().name());
    }
}

