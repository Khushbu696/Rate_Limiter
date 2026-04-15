package com.ratelimiter.project.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class RateLimitRule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String targetType; // "GLOBAL", "USER", "API_KEY"
    private String targetValue; // ID or actual API Key
    private String endpoint;
    private int limitCount;
    private int timeWindow; // seconds
}
