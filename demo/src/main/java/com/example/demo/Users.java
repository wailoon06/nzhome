package com.example.demo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;


enum LevelType {
    A, B;
}

@Entity
@Table(name = "users", schema = "public") // Ensure schema is correctly set
public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "UserID")
    private Long userid;

    @Column(nullable = false)  // Ensure it cannot be null
    private String name;

    @Column(nullable = false, unique = true)  // Unique constraint for emails
    private String email;

    @Column(nullable = false)
    private String password;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "accesslevel", nullable = false)
    private LevelType accessLevel;

    public Users() {}

    public Users(String name, String email, String password, LevelType accessLevel) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.accessLevel = accessLevel;
    }
    
    // Getters and Setters
    public Long getUserId() { return userid; }

    public void setUserId(Long userid) { this.userid = userid; }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }

    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }

    public void setPassword(String password) { this.password = password; }

    public LevelType getAccessLevel() { return accessLevel; }

    public void setAccessLevel(LevelType accessLevel) { this.accessLevel = accessLevel; }
}
