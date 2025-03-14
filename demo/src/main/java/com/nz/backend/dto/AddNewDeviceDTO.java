package com.nz.backend.dto;

import java.time.LocalDate;


public class AddNewDeviceDTO {
    private String deviceName;
    private String brandName;
    private String createdBy;
    private LocalDate warrantyExp;
    private String picture;
    private String roomName;

    public AddNewDeviceDTO() {}

    public AddNewDeviceDTO(String deviceName, String brandName, String createdBy, LocalDate warrantyExp, String picture, String roomName){
        this.deviceName = deviceName;
        this.brandName = brandName;
        this.createdBy = createdBy;
        this.warrantyExp = warrantyExp;
        this.picture = picture;
        this.roomName = roomName;
    }

    public String getDeviceName(){
        return deviceName;
    }

    public void setDeviceName(String deviceName){
        this.deviceName = deviceName;
    }

    public String getBrandName(){
        return brandName;
    }

    public void setBrandName(String brandName){
        this.brandName = brandName;
    }

    public String getCreatedBy(){
        return createdBy;
    }

    public void setCreatedBy(String createdBy){
        this.createdBy = createdBy;
    }

    public LocalDate getWarrantyExp(){
        return warrantyExp;
    }

    public void setWarrantyExp(LocalDate warrantyExp){
        this.warrantyExp = warrantyExp;
    }

    public String getPicture(){
        return picture;
    }

    public void setPicture(String picture){
        this.picture = picture;
    }

    public String getRoomName() {
        return roomName;
    }

    public void setRoomname(String roomName) {
        this.roomName = roomName;
    }
}
