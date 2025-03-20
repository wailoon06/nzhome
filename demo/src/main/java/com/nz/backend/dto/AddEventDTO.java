package com.nz.backend.dto;

import java.time.LocalDate;
import java.util.List;

import com.nz.backend.entities.Device;

public class AddEventDTO {
    private String title;
    private String description;
    private LocalDate date;
    private boolean repeat;
    private List<Device> devices;

    public AddEventDTO() {
    }

    public AddEventDTO(String title, String description, LocalDate date, boolean repeat,
            List<Device> devices) {
        this.title = title;
        this.description = description;
        this.date = date;
        this.repeat = repeat;
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

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public boolean isRepeat() {
        return repeat;
    }

    public void setRepeat(boolean repeat) {
        this.repeat = repeat;
    }

    public List<Device> getDevices() {
        return devices;
    }

    public void setDevices(List<Device> devices) {
        this.devices = devices;
    }
}
