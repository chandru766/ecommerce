package com.ecommerce.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.demo.entity.Order;
import com.ecommerce.demo.entity.User;


public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
}
