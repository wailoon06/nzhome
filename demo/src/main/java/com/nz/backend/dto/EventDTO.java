package com.nz.backend.dto;

import java.time.LocalDateTime;

import com.nz.backend.entities.Family;
import com.nz.backend.entities.User;
import com.nz.backend.enums.OnOff;

public class EventDTO {
    private Long eventId;
    private String title;
    private String description;
    private LocalDateTime date;
    private OnOff onOff;
    private User createdBy;
    private Family family;
    private Long deviceid;
    private String deviceName; // Extra field

    public EventDTO(Long eventId, String title, String description, LocalDateTime date,
            OnOff onOff, User createdBy, Family family, Long deviceid, String deviceName) {
        this.eventId = eventId;
        this.title = title;
        this.description = description;
        this.date = date;
        this.onOff = onOff;
        this.createdBy = createdBy;
        this.family = family;
        this.deviceid = deviceid;
        this.deviceName = deviceName;
    }

    // Getters and Setters
    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
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

    public OnOff getOnOff() {
        return onOff;
    }

    public void setOnOff(OnOff onOff) {
        this.onOff = onOff;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }

    public Family getFamily() {
        return family;
    }

    public void setFamily(Family family) {
        this.family = family;
    }

    public Long getDeviceid() {
        return deviceid;
    }

    public void setDeviceid(Long deviceid) {
        this.deviceid = deviceid;
    }

    public String getDeviceName() {
        return deviceName;
    }

    public void setDeviceName(String deviceName) {
        this.deviceName = deviceName;
    }
}
