package com.nz.backend.dto;

public class DeviceNameDTO {
    private String deviceName;

    public DeviceNameDTO() {}

    public DeviceNameDTO(String deviceName){
        this.deviceName = deviceName;
    }

    public String getDeviceName(){
        return deviceName;
    }

    public void setDeviceName(String deviceName){
        this.deviceName = deviceName;
    }
}
