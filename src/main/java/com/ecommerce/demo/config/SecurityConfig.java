package com.ecommerce.demo.config;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.ecommerce.demo.security.CustomUserDetailsService;
import com.ecommerce.demo.security.JwtFilter;



@Configuration
public class SecurityConfig {


    private final JwtFilter jwtFilter;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Autowired
    public SecurityConfig(JwtFilter jwtFilter, CustomUserDetailsService customUserDetailsService) {
        this.jwtFilter = jwtFilter;
        this.customUserDetailsService = customUserDetailsService;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
           http
            .cors()
            .and()
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
            		
                .requestMatchers("/api/register", "/api/login").permitAll() // public APIs
                .requestMatchers("/api/admin/**").hasRole("ADMIN")          // admin endpoints
                .requestMatchers("/api/user/**").hasRole("USER")            // user endpoints
                .anyRequest().authenticated()                               // all others require login
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class); // JWT filter

        return http.build();
    }

    protected void configure(HttpSecurity http) throws Exception {
        http
            .authorizeRequests()
            .requestMatchers("/api/admin/product/**/image").permitAll() // allow public image access
            .anyRequest().authenticated();
    }



}

