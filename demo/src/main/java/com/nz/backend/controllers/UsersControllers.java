package com.nz.backend.controllers;

import java.util.HashMap;
import java.util.Map;

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
import org.springframework.web.bind.annotation.RestController;

import com.nz.backend.dto.ChangePassDTO;
import com.nz.backend.dto.ForgetPassDTO;
import com.nz.backend.dto.RegUserDTO;
import com.nz.backend.dto.LoginDTO;
import com.nz.backend.dto.RegOwnerDTO;
import com.nz.backend.entities.Family;
import com.nz.backend.entities.Role;
import com.nz.backend.entities.Users;
import com.nz.backend.repo.FamilyRepo;
import com.nz.backend.repo.UsersRepository;
import com.nz.backend.services.JwtService;

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
            || regOwnerDTO.getFamilyName() == null || regOwnerDTO.getFamPass() == null) {
            return ResponseEntity.badRequest().body("All fields are required!");
        }

        if (usersRepository.existsByEmail(regOwnerDTO.getEmail())) {
            return ResponseEntity.badRequest().body("Email already exists!");
        }

        if (usersRepository.existsByUsername(regOwnerDTO.getUsername())) {
            return ResponseEntity.badRequest().body("Username already exists!");
        }

        if (familyRepo.existsByFamilyName(regOwnerDTO.getFamilyName())){
            return ResponseEntity.badRequest().body("Family already exists!");
        }

        if (regOwnerDTO.getFamPass().equals(famPass)){
            return ResponseEntity.badRequest().body("Family key is wrong!");
        }

        Family family = new Family(
            regOwnerDTO.getFamilyName()
        );

        familyRepo.save(family);

        Users user = new Users(
            regOwnerDTO.getUsername(),
            regOwnerDTO.getEmail(),
            passwordEncoder.encode(regOwnerDTO.getPassword()),
            Role.Owner,
            family
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

        Users owner = usersRepository.findByEmail(email);

        if (owner.getRole().name().equals("user")){
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

        Users newUser = new Users(
            regUserDTO.getUsername(),
            regUserDTO.getEmail(),
            passwordEncoder.encode(regUserDTO.getPassword()),
            Role.User,
            family         
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

        Users user = usersRepository.findByEmail(loginDTO.getEmail());

        if (user == null || !passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body("Error: Wrong user or password");
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

        Users user = usersRepository.findByEmail(email);
        
        if (user == null){
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
        
        Users user = usersRepository.findByEmail(forgetPassDTO.getEmail());
        
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

        Users user = usersRepository.findByEmail(email);
        if (user == null){
            return ResponseEntity.badRequest().body("User not found");
        }

        Map<String, Object> response = new HashMap<>();
        response.put("user", Map.of(
            "username", user.getUsername(),
            "email", user.getEmail(),
            "role", user.getRole().name()
        ));
        
        return ResponseEntity.ok(response);  
    }

}
