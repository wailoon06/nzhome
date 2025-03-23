 package com.nz.backend.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "room")
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RoomID")
    private Long roomid;

    @Column(nullable = false, unique = true)
    private String roomName;

    @OneToOne
    @JoinColumn(name = "userid")
    private User createdBy;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdTime;

    @PrePersist
    protected void onCreate() {
        createdTime = LocalDateTime.now();
    }  

    @OneToOne
    @JoinColumn(name = "familyid")
    private Family family;

    @Column(columnDefinition = "text")
    private String picture;

    // Constructors
    public Room() {}

    public Room(String roomName, User createdBy, Family family, String picture) {
        this.roomName = roomName;
        this.createdBy = createdBy;
        this.family = family;
        this.picture = picture;
    }

    // Getters and Setters
    public Long getRoomid() {
        return roomid;
    }

    public void setRoomid(Long roomid) {
        this.roomid = roomid;
    }

    public String getRoomName() {
        return roomName;
    }

    public void setRoomName(String roomName) {
        this.roomName = roomName;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }

    public LocalDateTime getCreatedTime() {
        return createdTime;
    }

    public Family getFamily() {
        return family;
    }

    public void setFamily(Family family) {
        this.family = family;
    }

    public String getPicture() { return picture; }

    public void setPicture(String picture) { this.picture = picture; }

}
