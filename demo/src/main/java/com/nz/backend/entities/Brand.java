package com.nz.backend.entities;

import com.nz.backend.enums.DeviceType;
import com.nz.backend.enums.Role;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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

    @Enumerated(EnumType.STRING)
    @Column(name = "devicetype", nullable = false)
    private DeviceType devicetype;
    
    @Column(nullable = false)
    private String picture;

    // Constructors
    public Brand() {}

    public Brand(String brandname, String picture, DeviceType devicetype) {
        this.brandname = brandname;
        this.devicetype = devicetype;
        this.picture = picture;
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

    public DeviceType getDeviceType() {
        return devicetype;
    }

    public void setDeviceType(DeviceType devicetype) {
        this.devicetype = devicetype;
    }

    public String getPicture() { return picture; }

    public void setPicture(String picture) { this.picture = picture; }
}
