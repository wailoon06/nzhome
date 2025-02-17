package com.example.demo;

public class LoginResponse {
    private String token;
    private String accessLevel;

    public LoginResponse(String token, String accessLevel) {
        this.token = token;
        this.accessLevel = accessLevel;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getAccessLevel() { return accessLevel; }
    public void setAccessLevel(String accessLevel) { this.accessLevel = accessLevel; }
}