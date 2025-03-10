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
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Brandid")
    private Long brandid;

    @Column(nullable = false, unique = true)
    private String brandName;

    public Brand() {}

    public Brand(String brandName) {
        this.brandName = brandName;
    }

    // Getters and Setters
    public Long getBrandid() {
        return brandid;
    }

    public void setBrandid(Long brandid) {
        this.brandid = brandid;
    }

    public String getBrandName() {
        return brandName;
    }

    public void setBrandName(String brandName) {
        this.brandName = brandName;
    }
}
