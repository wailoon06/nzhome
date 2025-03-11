package com.nz.backend.dto;

import java.util.List;

public class EmailDTO {
    // For single user operation
    private String email;
    private List<String> emails;
    private List<UserEmail> users;
    
    // Constructor
    public EmailDTO() {}

    public EmailDTO(String email) {
        this.email = email;
    }

    public EmailDTO(List<String> emails) {
        this.emails = emails;
    }

    public EmailDTO(List<String> emails, List<UserEmail> users) {
        this.emails = emails;
        this.users = users;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<String> getEmails() {
        return emails;
    }

    public void setEmails(List<String> emails) {
        this.emails = emails;
    }

    public List<UserEmail> getUsers() {
        return users;
    }

    public void setUsers(List<UserEmail> users) {
        this.users = users;
    }

    // Inner class for user email
    public static class UserEmail {
        private String email;
        
        // Constructors
        public UserEmail() {}

        public UserEmail(String email) {
            this.email = email;
        }

        // Getters and Setters
        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }
    }
}



