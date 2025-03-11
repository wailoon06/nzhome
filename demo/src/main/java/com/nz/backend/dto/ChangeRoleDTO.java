package com.nz.backend.dto;

import java.util.List;

import com.nz.backend.enums.Role;

public class ChangeRoleDTO {
    private List<UserRoleChange> users;
    
    public ChangeRoleDTO() {}
    
    public ChangeRoleDTO(List<UserRoleChange> users) {
        this.users = users;
    }
    
    public List<UserRoleChange> getUsers() {
        return users;
    }

    public void setUsers(List<UserRoleChange> users) {
        this.users = users;
    }
    
    public static class UserRoleChange {
        private String email;
        private Role role;
        
        public UserRoleChange() {}
        
        public UserRoleChange(String email, Role role) {
            this.email = email;
            this.role = role;
        }
        
        public String getEmail() {
            return email;
        }
        
        public void setEmail(String email) {
            this.email = email;
        }
        
        public Role getRole() {
            return role;
        }
        
        public void setRole(Role role) {
            this.role = role;
        }
    }
}
