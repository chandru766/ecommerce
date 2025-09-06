package com.ecommerce.demo.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ecommerce.demo.entity.Product;
import com.ecommerce.demo.repository.ProductRepository;

@RestController
@RequestMapping("/api/admin/product")
@CrossOrigin(origins = "http://localhost:5173") // React frontend
public class AdminController {

    @Autowired
    private ProductRepository productRepository;

    // 📦 Get all products
    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // ➕ Create product (with optional image)
    @PostMapping
    public ResponseEntity<Product> createProduct(
            @RequestParam String name,
            @RequestParam String description,
            @RequestParam String category,
            @RequestParam Double price,
            @RequestParam(required = false) MultipartFile image
    ) throws IOException {
        System.out.println("📥 Creating product: " + name + ", " + price);

        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setCategory(category);
        product.setPrice(price);

        if (image != null && !image.isEmpty()) {
            System.out.println("📸 Image uploaded: " + image.getOriginalFilename());
            product.setImage(image.getBytes());
            product.setImageType(image.getContentType());
        }

        Product saved = productRepository.save(product);
        System.out.println("✅ Saved product ID: " + saved.getId());
        return ResponseEntity.ok(saved);
    }


    // ✏️ Update product
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @RequestParam String name,
            @RequestParam String description,
            @RequestParam String category,
            @RequestParam Double price,
            @RequestParam(required = false) MultipartFile image
    ) throws IOException {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setName(name);
        product.setDescription(description);
        product.setCategory(category);
        product.setPrice(price);

        if (image != null && !image.isEmpty()) {
            product.setImage(image.getBytes());
            product.setImageType(image.getContentType());
        }

        return ResponseEntity.ok(productRepository.save(product));
    }

    // ❌ Delete product
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // 🖼️ Serve product image dynamically
    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getProductImage(@PathVariable Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (product.getImage() == null || product.getImageType() == null) {
            return ResponseEntity.notFound().build();
        }

        MediaType mediaType = MediaType.parseMediaType(product.getImageType());
        return ResponseEntity.ok()
                .contentType(mediaType)
                .body(product.getImage());
    }
}
