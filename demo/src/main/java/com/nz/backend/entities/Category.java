package com.nz.backend.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "category")
public class Category {

    // Attributes
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Categoryid")
    private Long categoryid;

    @Column(nullable = false)
    private String categoryname;
    
    // Constructors
    public Category() {}

    public Category(String categoryname) {
        this.categoryname = categoryname;
    }

    // Getters and Setters
    public Long getCategoryid() {
        return categoryid;
    }

    public void setcategoryid(Long categoryid) {
        this.categoryid = categoryid;
    }

    public String getCategoryName() {
        return categoryname;
    }

    public void setCategoryName(String categoryname) {
        this.categoryname = categoryname;
    }
}
