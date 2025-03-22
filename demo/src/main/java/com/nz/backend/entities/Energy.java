package com.nz.backend.entities;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "energy")
public class Energy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Energyid")
    private Long energyid;

    @ManyToOne
    @JoinColumn(name = "Deviceid", nullable = false)
    private Device device;

    @Column(name = "energyConsumption")
    private Double energyConsumption;

    @Column(name = "energyGeneration")
    private Double energyGeneration;

    @Column(name = "date", nullable = false, updatable = false)
    private LocalDate date;

    @ManyToOne
    @JoinColumn(name = "Familyid") 
    private Family family;

    // Constructors
    public Energy() {}

    public Energy(Device device, Double energyConsumption, Double energyGeneration, LocalDate date, Family family) {
        this.device = device;
        this.energyConsumption = energyConsumption;
        this.energyGeneration = energyGeneration;
        this.date = date;
        this.family = family;
    }

    // Getters and Setters
    public Long getEnergyId() {
        return energyid;
    }

    public void setEnergyId(Long energyid) {
        this.energyid = energyid;
    }

    public Device getDevice() {
        return device;
    }

    public void setDevice(Device device) {
        this.device = device;
    }

    public Double getEnergyConsumption() {
        return energyConsumption;
    }

    public Double getEnergyGeneration() {
        return energyGeneration;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Family getFamily() { 
        return family; 
    }

    public void setFamily(Family family) { 
        this.family = family; 
    }
}
