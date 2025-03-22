package com.nz.backend.dto;

import java.time.LocalDate;

public class EnergyDTO {
    private Long id;
    private LocalDate date;
    private Double energyConsumption;
    private Double energyGeneration;
    private Long deviceid;

    // Constructor
    public EnergyDTO(Long id, LocalDate date, Double energyConsumption, Double energyGeneration, Long deviceid) {
        this.id = id;
        this.date = date;
        this.energyConsumption = energyConsumption;
        this.energyGeneration = energyGeneration;
        this.deviceid = deviceid;
    }

    // Getters
    public Long getId() { return id; }
    public LocalDate getDate() { return date; }
    public Double getEnergyConsumption() { return energyConsumption; }
    public Double getEnergyGeneration() { return energyGeneration; }
    public Long getDeviceId() { return deviceid; }
}

