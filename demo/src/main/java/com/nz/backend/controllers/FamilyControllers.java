package com.nz.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
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

    @DeleteMapping("/deleteUserFam")
    public ResponseEntity<?> dltUser_Fam() {
        //Get token

        //Check token's role, if is user/admin no access

        //Create dto with email

        //Check if they are same family

        //Check the email's user role,if is owner then cannot delete

        //Delete user

        return null;
    }

    @GetMapping("/getUsersFam")
    public ResponseEntity<?> getUser_Fam( ) {
        //Get token

        //Get family from token

        //Return all users in the family with hashmap, with their email username and role

        return null;
    }

    @PutMapping("/changeRoleFam")
    public ResponseEntity<?> changeRole_Fam( ) {
        //Create DTO with role
        
        //Get token

        //Check token's role, if is user/admin no access

        //Change role

        return null;
    }


}