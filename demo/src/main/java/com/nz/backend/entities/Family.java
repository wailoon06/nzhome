package com.nz.backend.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Family")
public class Family {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "familyid")
    private Long familyid;

    @Column(name = "familyname", nullable = false)
    private String familyName;

    // Default constructor
    public Family() {}

    // Constructor
    public Family(String familyName) {
        this.familyName = familyName;
    }

    // Getters and Setters
    public Long getFamilyid() {
        return familyid;
    }

    public void setFamilyid(Long familyid) {
        this.familyid = familyid;
    }

    public String getFamilyName() {
        return familyName;
    }

    public void setFamilyName(String familyName) {
        this.familyName = familyName;
    }
}

