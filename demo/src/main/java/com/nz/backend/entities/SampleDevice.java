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
    @JoinColumn(name = "categoryid", nullable = false)
    private Category category;

    @Column
    private String picture;

    // Constructors
    public SampleDevice() {}

    public SampleDevice(String sampleName, Category category, String picture) {
        this.sampleName = sampleName;
        this.category = category;
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

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public String getPicture() {
        return picture;
    }

    public void setPicture(String picture) {
        this.picture = picture;
    }
}
