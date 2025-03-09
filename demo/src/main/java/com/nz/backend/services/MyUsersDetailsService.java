package com.nz.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.nz.backend.entities.Users;
import com.nz.backend.repo.UsersRepository;

@Service
public class MyUsersDetailsService implements UserDetailsService{

    @Autowired
    private UsersRepository repo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        
        Users user = repo.findByEmail(username);

        if (user == null){
            System.out.println("User not found");
            throw new UsernameNotFoundException("User not found");
        }

        return new MyUserDetails(user);
    }
    
}
