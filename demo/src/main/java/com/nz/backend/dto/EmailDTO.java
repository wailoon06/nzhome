package com.nz.backend.dto;

public class EmailDTO {
    private String email;

    public EmailDTO() {}

    public EmailDTO(String email) {
        this.email = email;
    }

    public String getEmail(){
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
