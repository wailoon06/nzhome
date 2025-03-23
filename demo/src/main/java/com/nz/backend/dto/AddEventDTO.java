package com.nz.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public class AddEventDTO {
    private String title;
    private String description;
    private LocalDateTime date;
    // private boolean repeat;
    private List<Long> devices;
    private String onOff;

    public AddEventDTO() {
    }

    public AddEventDTO(String title, String description, LocalDateTime date, String onOff,
            List<Long> devices) {
        this.title = title;
        this.description = description;
        this.date = date;
        this.onOff = onOff;
        this.devices = devices;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    // public boolean isRepeat() {
    // return repeat;
    // }

    // public void setRepeat(boolean repeat) {
    // this.repeat = repeat;
    // }

    public String getOnOff() {
        return onOff;
    }

    public void setOnOff(String onOff) {
        this.onOff = onOff;
    }

    public List<Long> getDevices() {
        return devices;
    }

    public Long getDeviceId(int i) {

        return devices.get(i);
    }

    public int lengthOfDevices() {
        return devices.size();
    }

    public void setDevices(List<Long> devices) {
        this.devices = devices;
    }
}
