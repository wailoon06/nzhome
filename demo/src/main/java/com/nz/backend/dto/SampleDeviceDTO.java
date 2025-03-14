package com.nz.backend.dto;

public class SampleDeviceDTO {
    private String sampleName;
    private String brandName;
    private String picture;

    public SampleDeviceDTO(String sampleName, String brandName, String picture) {
        this.sampleName = sampleName;
        this.brandName = brandName;
        this.picture = picture;
    }

    // Getters
    public String getSampleName() {
        return sampleName;
    }

    public String getBrandName() {
        return brandName;
    }

    public String getPicture() {
        return picture;
    }
}

