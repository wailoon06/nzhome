package com.nz.backend.dto;

public class SampleDeviceDTO {
    private String sampleName;
    private String categoryName;
    private String picture;

    public SampleDeviceDTO(String sampleName, String categoryName, String picture) {
        this.sampleName = sampleName;
        this.categoryName = categoryName;
        this.picture = picture;
    }

    // Getters
    public String getSampleName() {
        return sampleName;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public String getPicture() {
        return picture;
    }
}

