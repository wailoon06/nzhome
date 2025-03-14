package com.nz.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.nz.backend.entities.User;
import com.nz.backend.repo.UserRepo;

@Service
public class MyUsersDetailsService implements UserDetailsService{

    @Autowired
    private UserRepo repo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        
        User user = repo.findByEmail(username);

        if (user == null){
            System.out.println("User not found");
            throw new UsernameNotFoundException("User not found");
        }

        return new MyUserDetails(user);
    }
    
}
