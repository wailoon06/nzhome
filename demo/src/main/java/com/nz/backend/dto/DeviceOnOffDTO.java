package com.nz.backend.dto;

public class DeviceOnOffDTO {
    private String onOff;
    private String deviceName;
    private Long deviceid;

    public DeviceOnOffDTO(){}

    public DeviceOnOffDTO(String onOff, String deviceName, Long deviceid){
        this.onOff = onOff;
        this.deviceName = deviceName;
        this.deviceid = deviceid;
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

    public Long getDeviceid(){
        return deviceid;
    }

    public void setDeviceid(Long deviceid){
        this.deviceid = deviceid;
    }
}
