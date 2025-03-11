package com.nz.backend.controllers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.management.RuntimeErrorException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestHeader;

import com.nz.backend.dto.ChangeRoleDTO;
import com.nz.backend.dto.EmailDTO;
import com.nz.backend.dto.RoleDTO;
import com.nz.backend.entities.Family;
import com.nz.backend.entities.User;
import com.nz.backend.enums.Role;
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
    private JwtService jwtService;

    @Value("${jwt.secret.key}")
    private String secretKey;

    @DeleteMapping("/deleteUserFam")
    public ResponseEntity<?> dltUser_Fam(@RequestBody EmailDTO emailDTO, @RequestHeader("Authorization") String token) {
        if (token == null){
            return ResponseEntity.badRequest().body("Invalid token!");
        }

        String jwtToken = token.substring(7);
        String email = jwtService.extractEmail(jwtToken);
        User owner = usersRepository.findByEmail(email);

        if (owner.getRole().name().equals("User") || owner.getRole().name().equals("Admin")) {
            return ResponseEntity.badRequest().body("You don't have access!");
        }
        
        /* Single User */
        if (emailDTO.getEmail() != null && emailDTO.getEmails() == null) {
            String targetEmail = emailDTO.getEmail();
            User matchUser = usersRepository.findByEmail(targetEmail);

            if (matchUser == null) {
                return ResponseEntity.badRequest().body("User not found!");
            }

            if (!owner.getFamily().equals((matchUser.getFamily()))) {
                return ResponseEntity.badRequest().body("The user is not in your family!");
            }

            if(matchUser.getRole().name().equals("owner")) {
                return ResponseEntity.badRequest().body("You are not allow to delete owner!");
            }

            usersRepository.delete(matchUser);

            return ResponseEntity.ok(matchUser.getUsername() + " has been deleted from the family!");
        }

        /* Multiple Users */
        List<String> results = new ArrayList<>();

        for (EmailDTO.UserEmail userEmail : emailDTO.getUsers()) {
            User matchUser = usersRepository.findByEmail(userEmail.getEmail());

            if (matchUser == null) {
                results.add("User not found!");
                continue;
            }
    
            if (!owner.getFamily().equals((matchUser.getFamily()))) {
                results.add("The user is not in your family!");
                continue;
            }
    
            if(matchUser.getRole().name().equals("owner")) {
                results.add("You are not allow to delete owner!");
                continue;
            }
    
            usersRepository.delete(matchUser);
            results.add(matchUser.getUsername() + " has been deleted from the family!");
        }   

        

        return ResponseEntity.ok(results);
        
    }

    @GetMapping("/getUserFam")
    public List<?> getUser_Fam(@RequestHeader("Authorization") String token) {
        
        if (token == null){
            throw new RuntimeErrorException(null, "Invalid token!");
        }

        String jwtToken = token.substring(7);
        String email = jwtService.extractEmail(jwtToken);

        User owner = usersRepository.findByEmail(email);

        Long family = owner.getFamily().getFamilyid();

        List<User> users = usersRepository.findByFamilyFamilyid(family);
        
        return users.stream().map(user -> {
            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("username", user.getUsername());
            userInfo.put("email", user.getEmail());
            userInfo.put("role", user.getRole());
            return userInfo;
        }).collect(Collectors.toList());
    }

    @PutMapping("/changeRoleFam")
    public ResponseEntity<?> changeRole_Fam(@RequestBody ChangeRoleDTO changeRoleDTO, @RequestHeader("Authorization") String token) {

        if (token == null){
            return ResponseEntity.badRequest().body("Invalid token!");
        }

        String jwtToken = token.substring(7);
        String email = jwtService.extractEmail(jwtToken);
        User owner = usersRepository.findByEmail(email);

        if (owner.getRole().name().equals("User") || owner.getRole().name().equals("Admin")) {
            return ResponseEntity.badRequest().body("Access Denied!");
        }

        /* Single User */
        // String targetEmail = changeRoleDTO.getEmail();
        // User matchUser = usersRepository.findByEmail(targetEmail);

        // if (matchUser == null) {
        //     return ResponseEntity.badRequest().body("User not found!");
        // }

        // if (matchUser.getRole().name().equals("Owner")){
        //     return ResponseEntity.badRequest().body("You cannot change the owner's role!");
        // }

        // Role newRole = changeRoleDTO.getRole();
        // matchUser.setRole(newRole);

        // usersRepository.save(matchUser);

        // return ResponseEntity.ok(matchUser.getUsername() + "'s role has been changed to " + newRole.name());

        /* Multiple users */
        List<String> results = new ArrayList<>();

        for (ChangeRoleDTO.UserRoleChange change : changeRoleDTO.getUsers()){
            String targetEmail = change.getEmail();
            User targetUser = usersRepository.findByEmail(targetEmail);
            
            if (targetUser == null){
                results.add(targetEmail + " not found!");
                continue;
            }

            if (targetUser.getRole().name().equals("Owner")){
                results.add(targetEmail + " role's is owner!");
                continue;
            }

            Role newRole = change.getRole();

            if (targetUser.getRole().name().equals(newRole.name())){
                results.add("The role is the same!");
                continue;
            }
            targetUser.setRole(newRole);
            usersRepository.save(targetUser);
            results.add(targetUser.getUsername() +"'s role has changed to " + newRole.name());

        }

        return ResponseEntity.ok(results);
    }
}