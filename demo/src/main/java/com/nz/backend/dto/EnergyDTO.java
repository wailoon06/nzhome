package com.nz.backend.dto;

import java.time.LocalDate;

public class EnergyDTO {
    private Long id;
    private LocalDate date;
    private Double energyConsumption;

    // Constructor
    public EnergyDTO(Long id, LocalDate date, Double energyConsumption) {
        this.id = id;
        this.date = date;
        this.energyConsumption = energyConsumption;
    }

    // Getters
    public Long getId() { return id; }
    public LocalDate getDate() { return date; }
    public Double getEnergyConsumption() { return energyConsumption; }
}

