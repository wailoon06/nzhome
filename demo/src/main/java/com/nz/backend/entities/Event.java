package com.nz.backend.entities;

import java.time.LocalDateTime;
import java.util.List;
import com.nz.backend.enums.OnOff;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

@Entity
@Table(name = "event")
public class Event {

    // Attributes
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Eventid")
    private Long eventId;

    @Column(name = "title", nullable = false, unique = true)
    private String title;

    @Column
    private String description;

    @Column(nullable = false)
    private LocalDateTime date;

    @Column(nullable = false)
    private boolean repeat;

    @ManyToOne
    @JoinColumn(name = "Userid")
    private User createdBy;

    @ManyToOne
    @JoinColumn(name = "Familyid")
    private Family family;

    @Column
    private List<Long> devices;

    @Column
    private Long deviceid;

    @Enumerated(EnumType.STRING)
    @Column(name = "onOff", nullable = false)
    private OnOff onOff;

    // Constructors
    public Event() {
    }

    public Event(String title, String description, LocalDateTime date, OnOff onOff, User createdBy, Family family,
            Long deviceid) {
        this.title = title;
        this.description = description;
        this.date = date;
        // this.repeat = repeat;
        this.onOff = onOff;
        this.createdBy = createdBy;
        this.family = family;
        this.deviceid = deviceid;
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

    public boolean isRepeat() {
        return repeat;
    }

    public void setRepeat(boolean repeat) {
        this.repeat = repeat;
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

    public List<Long> getDevices() {
        return devices;
    }

    public void setDevices(List<Long> devices) {
        this.devices = devices;
    }

    public Long getDeviceId(int i) {
        return devices.get(i);
    }

    public OnOff getOnOff() {
        return onOff;
    }

    public void setOnOff(OnOff onOff) {
        this.onOff = onOff;
    }
}
