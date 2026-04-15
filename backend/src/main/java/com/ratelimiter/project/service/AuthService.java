package com.ratelimiter.project.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import com.ratelimiter.project.entity.User;
import com.ratelimiter.project.repository.UserRepository;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    public User register(User user) {
        user.setApiKey(UUID.randomUUID().toString());
        user.setRole("USER"); // Default Role
        return userRepository.save(user);
    }

    public User login(String email, String password) {
        return userRepository.findAll()
                .stream()
                .filter(u -> u.getEmail().equals(email) && u.getPassword().equals(password))
                .findFirst()
                .orElseThrow();
    }
}