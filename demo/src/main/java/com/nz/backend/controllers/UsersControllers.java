package com.nz.backend.controllers;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.nz.backend.dto.ChangePassDTO;
import com.nz.backend.dto.ForgetPassDTO;
import com.nz.backend.dto.LoginDTO;
import com.nz.backend.dto.RegOwnerDTO;
import com.nz.backend.dto.RegUserDTO;
import com.nz.backend.entities.Family;
import com.nz.backend.entities.User;
import com.nz.backend.enums.Role;
import com.nz.backend.repo.FamilyRepo;
import com.nz.backend.repo.UsersRepository;
import com.nz.backend.services.JwtService;

import io.jsonwebtoken.io.IOException;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class UsersControllers {

    @Autowired
    private UsersRepository usersRepository;
    
    @Autowired
    private FamilyRepo familyRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Value("${jwt.secret.key}")
    private String secretKey;
    
    @Value("$(fam.pass)")
    private String famPass;

    @PostMapping("/registerOwner")
    public ResponseEntity<?> register_owner(@RequestBody RegOwnerDTO regOwnerDTO) {
        
        if (regOwnerDTO.getUsername() == null || regOwnerDTO.getEmail() == null || regOwnerDTO.getPassword() == null 
            || regOwnerDTO.getFamilyName() == null || regOwnerDTO.getCode() == null) {
            return ResponseEntity.badRequest().body("All fields are required!");
        }

        if (!regOwnerDTO.getCode().equals(famPass)){
            return ResponseEntity.badRequest().body("Invalid Activation Code!");
        }

        if (familyRepo.existsByFamilyName(regOwnerDTO.getFamilyName())){
            return ResponseEntity.badRequest().body("Family name already exists!");
        }

        if (usersRepository.existsByEmail(regOwnerDTO.getEmail())) {
            return ResponseEntity.badRequest().body("Email already exists!");
        }

        if (usersRepository.existsByUsername(regOwnerDTO.getUsername())) {
            return ResponseEntity.badRequest().body("Username already exists!");
        }

        Family family = new Family(
            regOwnerDTO.getFamilyName()
        );

        familyRepo.save(family);

        User user = new User(
            regOwnerDTO.getUsername(),
            regOwnerDTO.getEmail(),
            passwordEncoder.encode(regOwnerDTO.getPassword()),
            Role.Owner,
            family,
            null
        );

        usersRepository.save(user);

        return ResponseEntity.ok("Successfully Registered!");

    }

    @PostMapping("/registerUser")
    public ResponseEntity<?> register_user(@RequestBody RegUserDTO regUserDTO, @RequestHeader("Authorization") String token) {
        if (token == null){
            return ResponseEntity.badRequest().body("Invalid token!");
        }

        String jwtToken = token.substring(7);
        String email = jwtService.extractEmail(jwtToken);

        User owner = usersRepository.findByEmail(email);

        if (owner.getRole().name().equals("User")){
            return ResponseEntity.badRequest().body("You don't have access!");
        }

        if (regUserDTO.getUsername() == null || regUserDTO.getEmail() == null || regUserDTO.getPassword() == null) {
            return ResponseEntity.badRequest().body("All fields are required!");
        }

        if (usersRepository.existsByEmail(regUserDTO.getEmail())) {
            return ResponseEntity.badRequest().body("Email already exists!");
        }

        if (usersRepository.existsByUsername(regUserDTO.getUsername())) {
            return ResponseEntity.badRequest().body("Username already exists!");
        }
        
        Family family = owner.getFamily();
        familyRepo.save(family);

        User newUser = new User(
            regUserDTO.getUsername(),
            regUserDTO.getEmail(),
            passwordEncoder.encode(regUserDTO.getPassword()),
            Role.User,
            family,
            null     
        );

        usersRepository.save(newUser);

        return ResponseEntity.ok("Successfully Registered");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {
        
        if (loginDTO.getEmail() == null) {
            return ResponseEntity.badRequest().body("Email is required");
        }

        if (loginDTO.getPassword() == null) {
            return ResponseEntity.badRequest().body("Password is required");
        }

        User user = usersRepository.findByEmail(loginDTO.getEmail());

        if (user == null) {
            return ResponseEntity.badRequest().body("User not found!");
        }

        if (!passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body("Wrong password!");
        }

        String token = jwtService.generateToken(user.getEmail());
        
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

    @PutMapping("/changePassword")
    public ResponseEntity<?> changePassword(@RequestBody ChangePassDTO changePassDTO, @RequestHeader("Authorization") String token){
        
        if (token == null){
            return ResponseEntity.badRequest().body("Invalid token");
        }

        String jwtToken = token.substring(7);
        String email = jwtService.extractEmail(jwtToken);

        User user = usersRepository.findByEmail(email);
        
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        if (!passwordEncoder.matches(changePassDTO.getOldPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Incorrect old password");
        }

        user.setPassword(passwordEncoder.encode(changePassDTO.getNewPassword()));
        usersRepository.save(user);

        return ResponseEntity.ok("Succesfully change password");
    }

    @PutMapping("/forgetPassword")
    public ResponseEntity<?> forgetPassword(@RequestBody ForgetPassDTO forgetPassDTO){
        
        User user = usersRepository.findByEmail(forgetPassDTO.getEmail());
        
        if (user == null){
            return ResponseEntity.badRequest().body("User not found");
        }

        if (!passwordEncoder.matches(forgetPassDTO.getOldPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Incorrect old password");
        }

        user.setPassword(passwordEncoder.encode(forgetPassDTO.getNewPassword()));
        usersRepository.save(user);

        return ResponseEntity.ok("Succesfully change password");
    }

    @GetMapping("/getUserDetails")
    public ResponseEntity<?> getUserDetails(@RequestHeader("Authorization") String token){

        if (token == null){
            return ResponseEntity.badRequest().body("Invalid token");
        }

        String jwtToken = token.substring(7);
        String email = jwtService.extractEmail(jwtToken);

        User user = usersRepository.findByEmail(email);
        if (user == null){
            return ResponseEntity.badRequest().body("User not found");
        }

        Map<String, Object> response = new HashMap<>();
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());
        response.put("role", user.getRole().name());
        response.put("createdDate", user.getCreatedDate());

        if (user.getPicture() != null) {
            response.put("picture", "data:image/png;base64," + user.getPicture()); // Convert to Base64 format
        } else {
            response.put("picture", null);
        }
        
        return ResponseEntity.ok(response);  
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadProfile(@RequestHeader("Authorization") String token, @RequestParam("file") MultipartFile file) throws java.io.IOException {

        if (file.getSize() > 5 * 1024 * 1024) {
            return ResponseEntity.badRequest().body("File size should not exceed 5MB!");
        }

        try {
            String base64Image = Base64.getEncoder().encodeToString(file.getBytes());

            if (token == null){
                return ResponseEntity.badRequest().body("Invalid token!");
            }
    
            String jwtToken = token.substring(7);
            String email = jwtService.extractEmail(jwtToken);
    
            User user = usersRepository.findByEmail(email);

            user.setPicture(base64Image);
            usersRepository.save(user);

            return ResponseEntity.ok("Profile picture uploaded successfully!");
        } catch (IOException e){
            return ResponseEntity.status(500).body("Failed to upload profile picture.");
        }
    }

}
