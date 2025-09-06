package com.ecommerce.demo.dto;

import java.util.List;

import com.ecommerce.demo.entity.Product;



public class OrderDTO {
    private Long id;
    private String status;
    private Double totalAmount;
    private List<Product> products; // List of products in this order

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public List<Product> getProducts() { return products; }
    public void setProducts(List<Product> products) { this.products = products; }
}
