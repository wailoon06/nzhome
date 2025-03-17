package com.nz.backend.dto;

import com.nz.backend.entities.Device;
import com.nz.backend.enums.OnOff;

public class DeviceRoomDTO {
    private String deviceName;
    private OnOff onOff;  
    private String categoryName; // Only return family name

    // Constructor
    public DeviceRoomDTO(Device device) {
        this.deviceName = device.getDeviceName();
        this.onOff = device.getOnOff();
        this.categoryName = device.getCategory().getCategoryName();
    }

    // Getters
    public String getDeviceName() { return deviceName; }
    public OnOff getOnOff() { return onOff; }
    public String getCategoryName() { return categoryName; }
}
