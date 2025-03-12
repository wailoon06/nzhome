package com.nz.backend.dto;

import java.time.LocalDateTime;
import com.nz.backend.entities.Brand;
import com.nz.backend.entities.User;

public class AddNewDeviceDTO {
    private String deviceName;
    private Brand brand;
    private User createdBy;
    private LocalDateTime warrantyExp;

    public AddNewDeviceDTO() {}

    public AddNewDeviceDTO(String deviceName, Brand brand, User createdBy, LocalDateTime warrantyExp){
        this.deviceName = deviceName;
        this.brand = brand;
        this.createdBy = createdBy;
        this.warrantyExp = warrantyExp;
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
}
