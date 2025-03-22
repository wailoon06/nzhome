package com.nz.backend.dto;

public class DeviceEnergyTotalDTO {
    private Long deviceId;
    private String deviceName;
    private String roomName;
    private String picture;
    private Double totalConsumption;
    private Double totalGeneration;
    
    // Constructor, getters, and setters
    
    public DeviceEnergyTotalDTO(Long deviceId, String deviceName, String roomName, String picture,
                              Double totalConsumption, Double totalGeneration) {
        this.deviceId = deviceId;
        this.deviceName = deviceName;
        this.roomName = roomName;
        this.picture = picture;
        this.totalConsumption = totalConsumption;
        this.totalGeneration = totalGeneration;
    }
    
    // Getters and setters
    public Double getTotalConsumption() { return totalConsumption; }
    public Double getTotalGeneration() { return totalGeneration; }
    public Double setTotalConsumption(Double totalConsumption) { return totalConsumption; }
    public Double setTotalGeneration(Double totalGeneration) { return totalGeneration; }
}
