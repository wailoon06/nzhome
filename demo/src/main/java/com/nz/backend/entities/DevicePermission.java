package com.nz.backend.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "device_permission")
public class DevicePermission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long permissionid;

    @ManyToOne
    @JoinColumn(name = "userid")
    private User user;

    @ManyToOne
    @JoinColumn(name = "deviceid")
    private Device device;

    @ManyToOne
    @JoinColumn(name = "grantedby")
    private User grantedBy; 

    public DevicePermission() {
    }

    public DevicePermission(User user, Device device, User grantedBy) {
        this.user = user;
        this.device = device;
        this.grantedBy = grantedBy;
    }

    // Getters and Setters

    public Long getPermissionid() {
        return permissionid;
    }

    public void setPermissionid(Long permissionid) {
        this.permissionid = permissionid;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Device getDevice() {
        return device;
    }

    public void setDevice(Device device) {
        this.device = device;
    }

    public User getGrantedBy() {
        return grantedBy;
    }

    public void setGrantedBy(User grantedBy) {
        this.grantedBy = grantedBy;
    }
}   

