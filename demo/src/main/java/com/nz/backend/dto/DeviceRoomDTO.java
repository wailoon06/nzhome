package com.nz.backend.dto;

import com.nz.backend.entities.Device;
import com.nz.backend.enums.OnOff;

public class DeviceRoomDTO {
    private String deviceName;
    private OnOff onOff;  
    private String brandName; // Only return family name

    // Constructor
    public DeviceRoomDTO(Device device) {
        this.deviceName = device.getDeviceName();
        this.onOff = device.getOnOff();
        this.brandName = device.getBrand().getBrandName();
    }

    // Getters
    public String getDeviceName() { return deviceName; }
    public OnOff getOnOff() { return onOff; }
    public String getBrandName() { return brandName; }
}
