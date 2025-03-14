package com.nz.backend.dto;

public class RegUserDTO {
    private String username;
    private String email;
    private String profilePic;

    public RegUserDTO () {}

    public RegUserDTO (String username, String email, String profilePic) {
        this.username = username;
        this.email = email;
        this.profilePic = profilePic;
    }

    // Getters and Setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getProfilePic() { return profilePic; }

    public void setProfilePic(String profilePic) { this.profilePic = profilePic; }

}
