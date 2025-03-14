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
@Table(name = "internet")
public class Internet {

    // Attributes
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "intID")
    private long intid;

    @Column(nullable = false, unique = true)
    private LocalDate date;

    @Column(nullable = false)
    private int usage;

    @ManyToOne
    @JoinColumn(name = "Familyid") 
    private Family family;

    // Constructor
    public Internet() {
    }

    public Internet(long intid, LocalDate date, int usage, Family family) {
        this.intid = intid;
        this.date = date;
        this.usage = usage;
        this.family = family;
    }

    // Getters and Setters
    public long getIntid() {
        return intid;
    }

    public void setIntid(long intid) {
        this.intid = intid;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public int getUsage() {
        return usage;
    }

    public void setUsage(int usage) {
        this.usage = usage;
    }

    public Family getFamily() { 
        return family; 
    }

    public void setFamily(Family family) { 
        this.family = family; 
    }
}
