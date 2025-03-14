package com.nz.backend.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "sample_device")
public class SampleDevice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SampleDeviceID")
    private Long sampledeviceid;

    @Column( nullable = false, unique = true)
    private String sampleName;

    @ManyToOne
    @JoinColumn(name = "Brandid", nullable = false)
    private Brand brand;

    @Column
    private String picture;

    // Constructors
    public SampleDevice() {}

    public SampleDevice(String sampleName, Brand brand, String picture) {
        this.sampleName = sampleName;
        this.brand = brand;
        this.picture = picture;
    }

    // Getters and Setters
    public Long getSampleDeviceId() {
        return sampledeviceid;
    }

    public void setSampleDeviceId(Long sampledeviceid) {
        this.sampledeviceid = sampledeviceid;
    }

    public String getSampleName() {
        return sampleName;
    }

    public void setSampleName(String sampleName) {
        this.sampleName = sampleName;
    }

    public Brand getBrand() {
        return brand;
    }

    public void setBrand(Brand brand) {
        this.brand = brand;
    }

    public String getPicture() {
        return picture;
    }

    public void setPicture(String picture) {
        this.picture = picture;
    }
}
