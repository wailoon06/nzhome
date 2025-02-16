package com.example.demo;

import jakarta.persistence.*;

import java.sql.Timestamp;

enum DeviceType {
    S, E;
}

@Entity
@Table(name = "Device")
public class Device {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "DeviceID")
    private Long deviceId;

    @Column(name = "SerialNumber", nullable = false)
    private Integer serialNumber;

    @ManyToOne
    @JoinColumn(name = "ImageID", nullable = false)
    private Image image;

    @Enumerated(EnumType.STRING)
    @Column(name = "DeviceType", nullable = false)
    private DeviceType deviceType;

    @Column(name = "Brand", nullable = false, length = 20)
    private String brand;

    @Column(name = "WarrantyExpiration", nullable = false)
    private Timestamp warrantyExpiration;

    @Column(name = "InstallationDate", nullable = false)
    private Timestamp installationDate;

    @Column(name = "InstalledBy", nullable = false, length = 20)
    private String installedBy;

    // Constructors
    public Device() {}

    public Device(Integer serialNumber, Image image, DeviceType deviceType, String brand, Timestamp warrantyExpiration, Timestamp installationDate, String installedBy) {
        this.serialNumber = serialNumber;
        this.image = image;
        this.deviceType = deviceType;
        this.brand = brand;
        this.warrantyExpiration = warrantyExpiration;
        this.installationDate = installationDate;
        this.installedBy = installedBy;
    }

    // Getters and Setters
    public Long getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(Long deviceId) {
        this.deviceId = deviceId;
    }

    public Integer getSerialNumber() {
        return serialNumber;
    }

    public void setSerialNumber(Integer serialNumber) {
        this.serialNumber = serialNumber;
    }

    public Image getImage() {
        return image;
    }

    public void setImage(Image image) {
        this.image = image;
    }

    public DeviceType getDeviceType() {
        return deviceType;
    }

    public void setDeviceType(DeviceType deviceType) {
        this.deviceType = deviceType;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public Timestamp getWarrantyExpiration() {
        return warrantyExpiration;
    }

    public void setWarrantyExpiration(Timestamp warrantyExpiration) {
        this.warrantyExpiration = warrantyExpiration;
    }

    public Timestamp getInstallationDate() {
        return installationDate;
    }

    public void setInstallationDate(Timestamp installationDate) {
        this.installationDate = installationDate;
    }

    public String getInstalledBy() {
        return installedBy;
    }

    public void setInstalledBy(String installedBy) {
        this.installedBy = installedBy;
    }
}

