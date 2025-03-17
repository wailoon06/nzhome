package com.nz.backend.dto;

import com.nz.backend.entities.Device;
import com.nz.backend.enums.OnOff;

public class DeviceRoomDTO {
    private String deviceName;
    private Long deviceid;
    private OnOff onOff;  
    private String categoryName; // Only return family name
    private String picture;

    // Constructor
    public DeviceRoomDTO(Device device) {
        this.deviceName = device.getDeviceName();
        this.onOff = device.getOnOff();
        this.categoryName = device.getCategory().getCategoryName();
        this.picture = device.getPicture();
        this.deviceid = device.getDeviceid();
    }

    // Getters
    public String getDeviceName() { return deviceName; }
    public OnOff getOnOff() { return onOff; }
    public String getCategoryName() { return categoryName; }
    public String getPicture() { return picture; }
    public Long getDeviceid() { return deviceid; }
}
