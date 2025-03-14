package com.nz.backend.dto;

public class DeviceOnOffDTO {
    private String onOff;
    private String deviceName;
    private String email;

    public DeviceOnOffDTO(){}

    public DeviceOnOffDTO(String onOff, String deviceName, String email){
        this.onOff = onOff;
        this.deviceName = deviceName;
        this.email = email;
    }

    public String getOnOff(){
        return onOff;
    }

    public void setOnOff(String onOff){
        this.onOff = onOff; 
    }

    public String getDeviceName(){
        return deviceName;
    }

    public void setDEmail(String email){
        this.email = email;
    }

    public void setEmail(String email){
        this.email = email;
    }
}
