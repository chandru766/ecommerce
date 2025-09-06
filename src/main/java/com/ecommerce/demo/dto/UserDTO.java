package com.ecommerce.demo.dto;

import java.util.List;

import com.ecommerce.demo.entity.User;



public class UserDTO {
    private Long id;
    private String name;
    private String username;
    private String email;
    private List<OrderDTO> orders;
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public List<OrderDTO> getOrders() {
		return orders;
	}
	public void setOrders(List<OrderDTO> orders) {
		this.orders = orders;
	}
	public UserDTO(Long id, String name, String username, String email, List<OrderDTO> orders) {
		super();
		this.id = id;
		this.name = name;
		this.username = username;
		this.email = email;
		this.orders = orders;
	}
	public UserDTO() {
		super();
	}

	private UserDTO toDto(User user) {
	    return new UserDTO(
	        user.getId(),
	        user.getName(),
	        user.getUsername(),
	        user.getEmail(),
	        null // map orders later if needed
	    );
	}



}
