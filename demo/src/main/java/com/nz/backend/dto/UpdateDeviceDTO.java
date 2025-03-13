package com.nz.backend.dto;

import java.time.LocalDateTime;

import com.nz.backend.enums.OnOff;

public class UpdateDeviceDTO {
    private String deviceName;
    private OnOff onOff;
    private String picture;

    public UpdateDeviceDTO(){}

    public UpdateDeviceDTO(String deviceName, OnOff onOff, String picture){
        this.deviceName = deviceName;;
        this.onOff = onOff;
        this.picture = picture;
    }

    public String getDeviceName(){
        return deviceName;
    }

    public void setDeviceName(String deviceName){
        this.deviceName = deviceName;
    }

    public OnOff getOnOff(){
        return onOff;
    }

    public void setOnOff(OnOff onOff){
        this.onOff = onOff;
    }

    public String getPicture(){
        return picture;
    }

    public void setPicture(String picture){
        this.picture = picture;
    }
}
