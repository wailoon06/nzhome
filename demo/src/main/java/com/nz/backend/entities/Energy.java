package com.nz.backend.entities;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
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

    @Column(name = "energyConsumption", nullable = false)
    private int energyConsumption;

    @Column(name = "energyUsage", nullable = false)
    private int energyUsage;

    @Column(name = "date", nullable = false, updatable = false)
    private LocalDate date;

    @PrePersist
    protected void onCreate() {
        date = LocalDate.now();
    }

    @ManyToOne
    @JoinColumn(name = "Familyid") 
    private Family family;

    // Constructors
    public Energy() {}

    public Energy(Device device, int energyConsumption, int energyUsage, Family family) {
        this.device = device;
        this.energyConsumption = energyConsumption;
        this.energyUsage = energyUsage;
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

    public int getEnergyConsumption() {
        return energyConsumption;
    }

    public void setEnergyConsumption(int energyConsumption) {
        this.energyConsumption = energyConsumption;
    }

    public int getEnergyUsage() {
        return energyUsage;
    }

    public void setEnergyUsage(int energyUsage) {
        this.energyUsage = energyUsage;
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
