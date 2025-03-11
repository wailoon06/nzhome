package com.nz.backend.dto;


public class RoleDTO {
    private String role;

    public RoleDTO(){}

    public RoleDTO(String role){
        this.role = role;
    }

    public String getRole(){
        return role;
    }

    public void setRole(String role){
        this.role = role;
    }
}
