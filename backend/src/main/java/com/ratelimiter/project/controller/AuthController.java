package com.ratelimiter.project.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

import com.ratelimiter.project.entity.User;
import com.ratelimiter.project.service.AuthService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody User user) {
        User savedUser = authService.register(user);
        Map<String, String> response = new HashMap<>();
        response.put("apiKey", savedUser.getApiKey());
        response.put("name", savedUser.getName());
        response.put("userId", String.valueOf(savedUser.getId()));
        response.put("role", savedUser.getRole());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        try {
            User loggedInUser = authService.login(user.getEmail(), user.getPassword());
            Map<String, String> response = new HashMap<>();
            response.put("apiKey", loggedInUser.getApiKey());
            response.put("name", loggedInUser.getName());
            response.put("userId", String.valueOf(loggedInUser.getId()));
            response.put("role", loggedInUser.getRole());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }
    }
}