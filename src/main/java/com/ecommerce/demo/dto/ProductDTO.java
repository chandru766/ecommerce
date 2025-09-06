package com.ecommerce.demo.dto;


import org.springframework.web.multipart.MultipartFile;

public class ProductDTO {
    private String name;
    private String description;
    private String category;
    private Double price;
    private MultipartFile image;

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public MultipartFile getImage() { return image; }
    public void setImage(MultipartFile image) { this.image = image; }
}
