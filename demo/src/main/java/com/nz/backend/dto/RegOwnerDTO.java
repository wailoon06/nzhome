package com.nz.backend.dto;

public class RegOwnerDTO {
    private String username;
    private String email;
    private String password;
    private String familyName;
    private String famPass;

    public RegOwnerDTO() {}

    public RegOwnerDTO(String username, String email, String password, String familyName, String famPass) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.familyName = familyName;
        this.famPass = famPass;
    }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getFamilyName() { return familyName; }
    public void setFamilyName(String familyName) { this.familyName = familyName; }

    public String getFamPass() { return famPass; }
    public void setFamPass(String famPass) { this.famPass = famPass; }
}

