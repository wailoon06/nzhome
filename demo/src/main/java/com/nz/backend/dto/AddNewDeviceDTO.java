package com.nz.backend.dto;

import java.time.LocalDateTime;

import com.nz.backend.entities.Brand;
import com.nz.backend.entities.User;

public class AddNewDeviceDTO {
    private String deviceName;
    private Brand brand;
    private User createdBy;
    private LocalDateTime warrantyExp;
    private String picture;

    public AddNewDeviceDTO() {}

    public AddNewDeviceDTO(String deviceName, Brand brand, User createdBy, LocalDateTime warrantyExp, String picture){
        this.deviceName = deviceName;
        this.brand = brand;
        this.createdBy = createdBy;
        this.warrantyExp = warrantyExp;
        this.picture = picture;
    }

    public String getDeviceName(){
        return deviceName;
    }

    public void setDeviceName(String deviceName){
        this.deviceName = deviceName;
    }

    public Brand getBrand(){
        return brand;
    }

    public void setBrand(Brand brand){
        this.brand = brand;
    }

    public User getCreatedBy(){
        return createdBy;
    }

    public void setCreatedBy(User createdBy){
        this.createdBy = createdBy;
    }

    public LocalDateTime getWarrantyExp(){
        return warrantyExp;
    }

    public void setWarrantyExp(LocalDateTime warrantyExp){
        this.warrantyExp = warrantyExp;
    }

    public String getPicture(){
        return picture;
    }

    public void setPicture(String picture){
        this.picture = picture;
    }
}
