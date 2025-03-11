package com.nz.backend.entities;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.nz.backend.enums.Role;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "UserID")
    private Long userid;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private Role role;

    @ManyToOne
    @JoinColumn(name = "Familyid") 
    private Family family;

    @Column(nullable = false, updatable = false)
    private LocalDate createddate;

    @PrePersist
    protected void onCreate() {
        createddate = LocalDate.now();
    }  

    public User() {}

    public User(String username, String email, String password, Role role, Family family) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
        this.family = family;
    }   
    
    // Getters and Setters
    public Long getUserId() { return userid; }

    public void setUserId(Long userid) { this.userid = userid; }

    public String getUsername() { return username; }

    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }

    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }

    public void setPassword(String password) { this.password = password; }

    public Role getRole() { return role; }

    public void setRole(Role role) { this.role = role; }

    public Family getFamily() { return family; }

    public void setFamily(Family family) { this.family = family; }

    public LocalDate getCreatedDate() {
        return createddate;
    }
}

