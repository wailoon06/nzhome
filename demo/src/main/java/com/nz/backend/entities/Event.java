package com.nz.backend.entities;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.*;

@Entity
@Table(name = "event")
public class Event {

    // Attributes
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Eventid")
    private Long eventId;

    @Column(nullable = false, unique = true)
    private String title;

    @Column
    private String description;

    @Column(nullable = false)
    private LocalDate date;

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

    // Constructors
    public Event() {
    }

    public Event(String title, String description, LocalDate date, boolean repeat, User createdBy, Family family,
            Long deviceid) {
        this.title = title;
        this.description = description;
        this.date = date;
        this.repeat = repeat;
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
}
