package com.nz.backend.entities;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.nz.backend.enums.OnOff;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "device")
public class Device {

    // Attributes
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Deviceid")
    private Long deviceid;

    @Column(nullable = false, unique = true)
    private String deviceName;

    @ManyToOne
    @JoinColumn(name = "BrandID") 
    private Brand brand;

    @ManyToOne
    @JoinColumn(name = "Userid")
    private User createdBy;

    @Column(nullable = false, updatable = false)
    private LocalDate createdTime;

    @PrePersist
    protected void onCreate() {
        createdTime = LocalDate.now();
    } 

    @Column(nullable = false)
    private LocalDate warrantyExp;

    @Enumerated(EnumType.STRING)
    @Column(name = "onOff", nullable = false)
    private OnOff onOff;

    @Column
    private String picture;

    @ManyToOne
    @JoinColumn(name = "Familyid")
    private Family family;

    @ManyToOne
    @JoinColumn(name = "roomid")
    private Room room;

    // Constructors
    public Device() {}

    public Device(String deviceName, Brand brand, User createdBy, 
                LocalDate warrantyExp, OnOff onOff, String picture, Family family, Room room) {
        this.deviceName = deviceName;
        this.brand = brand;
        this.createdBy = createdBy;
        this.warrantyExp = warrantyExp;
        this.onOff = onOff;
        this.picture = picture;
        this.family = family;
        this.room = room;
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

    public LocalDate getCreatedTime() {
        return createdTime;
    }

    public LocalDate getWarrantyExp() {
        return warrantyExp;
    }

    public void setWarrantyExp(LocalDate warrantyExp) {
        this.warrantyExp = warrantyExp;
    }

    public OnOff getOnOff(){
        return onOff;
    }

    public void setOnOff(OnOff onOff){
        this.onOff = onOff;
    }

    public String getPicture() { 
        return picture; 
    }

    public void setPicture(String picture) { 
        this.picture = picture; 
    }

    public Family getFamily(){
        return family;
    }

    public void setFamily(Family family) { 
        this.family = family; 
    }

    public Room getRoom() {
        return room;
    }

    public void setRoom(Room room) {
        this.room = room;
    }
}
