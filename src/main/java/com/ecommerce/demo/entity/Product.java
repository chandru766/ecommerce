package com.ecommerce.demo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String description;

    private String category;

    private Double price;

    @Lob
    @Column(name = "image", columnDefinition = "LONGBLOB")
    private byte[] image;  // Store actual image bytes

    @Column(name = "image_type")
    private String imageType;  // Store MIME type, e.g., "image/png"

    // Constructors
    public Product() {}

    public Product(String name, String description, String category, Double price, byte[] image, String imageType) {
        this.name = name;
        this.description = description;
        this.category = category;
        this.price = price;
        this.image = image;
        this.imageType = imageType;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public byte[] getImage() { return image; }
    public void setImage(byte[] image) { this.image = image; }

    public String getImageType() { return imageType; }
    public void setImageType(String imageType) { this.imageType = imageType; }
}
