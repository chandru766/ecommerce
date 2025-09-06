package com.ecommerce.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.demo.entity.CartItem;
import com.ecommerce.demo.entity.User;



public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUser(User user);
}

