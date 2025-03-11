package com.nz.backend.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "device")
public class Device {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Deviceid")
    private Long deviceid;

    @Column(nullable = false, unique = true)
    private String deviceName;

    @ManyToOne
    @JoinColumn(name = "BrandID") 
    private Brand brand;

    @OneToOne
    @JoinColumn(name = "username")
    private User createdBy;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdTime;

    @PrePersist
    protected void onCreate() {
        createdTime = LocalDateTime.now();
    }  

    @Column(nullable = false)
    private LocalDateTime warrantyExp;


    // Constructors
    public Device() {}

    public Device(String deviceName, Brand brand, User createdBy, LocalDateTime warrantyExp) {
        this.deviceName = deviceName;
        this.brand = brand;
        this.createdBy = createdBy;
        this.warrantyExp = warrantyExp;
    }

    // Getters and Setters
    public Long getDeviceid() {
        return deviceid;
    }

    public void setDeviceid(Long deviceid) {
        this.deviceid = deviceid;
    }

    public String getDeviceName() {
        return deviceName;
    }

    public void setDeviceName(String deviceName) {
        this.deviceName = deviceName;
    }

    public Brand getBrand() {
        return brand;
    }

    public void setBrand(Brand brand) {
        this.brand = brand;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }

    public LocalDateTime getCreatedTime() {
        return createdTime;
    }

    public LocalDateTime getWarrantyExp() {
        return warrantyExp;
    }

    public void setWarrantyExp(LocalDateTime warrantyExp) {
        this.warrantyExp = warrantyExp;
    }
}
