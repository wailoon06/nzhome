package com.nz.backend.controllers;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestHeader;

import com.nz.backend.dto.EmailDTO;
import com.nz.backend.dto.RoleDTO;
import com.nz.backend.entities.Family;
import com.nz.backend.entities.User;
import com.nz.backend.repo.FamilyRepo;
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
    public ResponseEntity<?> dltUser_Fam(@RequestHeader("Authorization") String token) {
        //Get token - done

        //Check token's role, if is user/admin no access - done

        //Create dto with email - done

        //Check if they are same family - done

        //Check the email's user role,if is owner then cannot delete

        //Delete user

        if (token == null){
            return ResponseEntity.badRequest().body("Invalid token!");
        }

        String jwtToken = token.substring(7);
        String email = jwtService.extractEmail(jwtToken);

        User owner = usersRepository.findByEmail(email);

        if(owner.getRole().name().equals("user") || owner.getRole().name().equals("admin")){
            return ResponseEntity.badRequest().body("You don't have access!");
        }

        EmailDTO emailDTO = new EmailDTO();
        String targetEmail = emailDTO.getEmail();
        User matchUser = usersRepository.findByEmail(targetEmail);

        if(owner.getFamily().equals(matchUser.getFamily())){

            if(matchUser.getRole().name().equals("owner")) {
                return ResponseEntity.badRequest().body("You are not allow to delete owner!");
            }

            else {
                usersRepository.delete(matchUser);
            }
        }
                
        
        return ResponseEntity.ok("You are not allow to delete user from other family!");
        
    }

    @GetMapping("/getUsersFam")
    public ResponseEntity<?> getUser_Fam(@RequestHeader("Authorization") String token) {
        //Get token

        //Get family from token

        //Return all users in the family with hashmap, with their email username and role

        // if (token == null){
        //     return ResponseEntity.badRequest().body("Invalid token!");
        // }

        // String jwtToken = token.substring(7);
        // String email = jwtService.extractEmail(jwtToken);

        // User owner = usersRepository.findByEmail(email);

        // EmailDTO emailDTO = new EmailDTO();
        // String targetEmail = emailDTO.getEmail();

        // User matchUser = usersRepository.findByEmail(targetEmail);

        // List<String> familyEmails = new ArrayList<>();

        // if(matchUser != null && matchUser.getFamily().equals(owner.getFamily())){
        //     familyEmails.add(matchUser.getEmail());
        // }


        return null;
    }

    @PutMapping("/changeRoleFam")
    public ResponseEntity<?> changeRole_Fam(@RequestHeader("Authorization") String token) {
        //Create DTO with role
        
        //Get token

        //Check token's role, if is user/admin no access

        //Change role

        if (token == null){
            return ResponseEntity.badRequest().body("Invalid token!");
        }

        String jwtToken = token.substring(7);
        String email = jwtService.extractEmail(jwtToken);

        User owner = usersRepository.findByEmail(email);

        if(owner.getRole().name().equals("user") || owner.getRole().name().equals("admin")) {
            return ResponseEntity.badRequest().body("Access Denied!");
        }

        else {
            //how to set new role to replace old role?
        }



        return null;
    }


}