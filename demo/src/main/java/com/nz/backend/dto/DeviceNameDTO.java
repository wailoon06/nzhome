package com.nz.backend.dto;

public class DeviceNameDTO {
    private String deviceName;
    public Long deviceid;

    public DeviceNameDTO() {}

    public DeviceNameDTO(String deviceName, Long deviceid){
        this.deviceName = deviceName;
        this.deviceid = deviceid;
    }

    public String getDeviceName(){
        return deviceName;
    }

    public void setDeviceName(String deviceName){
        this.deviceName = deviceName;
    }

    public Long getDeviceid(){
        return deviceid;
    }

    public void setDeviceid(Long deviceid){
        this.deviceid = deviceid;
    }
}
