package com.nz.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nz.backend.repo.UsersRepository;
import com.nz.backend.services.JwtService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class FamilyControllers {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Value("${jwt.secret.key}")
    private String secretKey;

    @Value("$(fam.pass)")
    private String famPass;
    
    // @PostMapping("/createFam")
    // public ResponseEntity<?> createFam(@RequestBody ) {
    //     return null;
    // }

    // @PostMapping("/addUserFam")
    // public ResponseEntity<?> addUser_Fam(@RequestBody ) {
    //     return null;
    // }

    // @DeleteMapping("/deleteUserFam")
    // public ResponseEntity<?> dltUser_Fam(@RequestBody ) {
    //     return null;
    // }

    // @GetMapping("/getUsersFam")
    // public ResponseEntity<?> getUser_Fam(@RequestBody ) {
    //     return null;
    // }

    // @PutMapping("/changeRoleFam")
    // public ResponseEntity<?> changeRole_Fam(@RequestBody ) {
    //     return null;
    // }


}