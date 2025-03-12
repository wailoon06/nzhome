package com.nz.backend.dto;

public class DeviceOnOffDTO {
    private String onOff;

    public DeviceOnOffDTO(){}

    public DeviceOnOffDTO(String onOff){
        this.onOff = onOff;
    }

    public String getOnOff(){
        return onOff;
    }

    public void setOnOff(String onOff){
        this.onOff = onOff; 
    }
}
