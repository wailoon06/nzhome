package com.nz.backend.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "brand")
public class Brand {

    // Attributes
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Brandid")
    private Long brandid;

    @Column(nullable = false)
    private String brandname;
    
    // Constructors
    public Brand() {}

    public Brand(String brandname) {
        this.brandname = brandname;
    }

    // Getters and Setters
    public Long getBrandid() {
        return brandid;
    }

    public void setBrandid(Long brandid) {
        this.brandid = brandid;
    }

    public String getBrandName() {
        return brandname;
    }

    public void setBrandName(String brandname) {
        this.brandname = brandname;
    }
}
