package com.ecommerce.demo.service;

import java.io.IOException;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ecommerce.demo.entity.Product;
import com.ecommerce.demo.repository.ProductRepository;





@Service
public class ProductService {

	private  ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Product saveProduct(String name, String description, String category, Double price, MultipartFile file) throws IOException {
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setCategory(category);
        product.setPrice(price);
        product.setImage(file.getBytes());        // ✅ actual bytes
        product.setImageType(file.getContentType()); // MIME type

        return productRepository.save(product);
    }

    public Optional<Product> getProduct(Long id) {
        return productRepository.findById(id);
    }

	public void save(Product product) {
		// TODO Auto-generated method stub

	}
}

