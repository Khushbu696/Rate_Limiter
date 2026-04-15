package com.ratelimiter.project.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import com.ratelimiter.project.entity.RateLimitRule;
import com.ratelimiter.project.repository.RateLimitRepository;
import com.ratelimiter.project.repository.RequestLogRepository;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class RateLimiterService {

    private final RequestLogRepository logRepository;
    private final RateLimitRepository rateLimitRepository;

    public boolean isAllowed(Long userId, String apiKey, String endpoint) {
        // 1. Check for API_KEY specific rule
        RateLimitRule rule = rateLimitRepository
                .findByTargetTypeAndTargetValueAndEndpoint("API_KEY", apiKey, endpoint)
                .orElse(null);

        // 2. Check for USER specific rule
        if (rule == null) {
            rule = rateLimitRepository
                .findByTargetTypeAndTargetValueAndEndpoint("USER", userId.toString(), endpoint)
                .orElse(null);
        }

        // 3. Check for GLOBAL rule
        if (rule == null) {
            rule = rateLimitRepository
                .findByTargetTypeAndEndpoint("GLOBAL", endpoint)
                .orElse(null);
        }

        if (rule == null) {
            return true; // No rule means unlimited
        }

        LocalDateTime windowStart = LocalDateTime.now()
                .minusSeconds(rule.getTimeWindow());

        long requestCount;
        if ("GLOBAL".equalsIgnoreCase(rule.getTargetType())) {
            requestCount = logRepository.countByEndpointAndTimestampAfter(endpoint, windowStart);
        } else if ("USER".equalsIgnoreCase(rule.getTargetType())) {
            requestCount = logRepository.countByUserIdAndEndpointAndTimestampAfter(userId, endpoint, windowStart);
        } else {
            // API_KEY
            requestCount = logRepository.countByApiKeyAndEndpointAndTimestampAfter(apiKey, endpoint, windowStart);
        }

        return requestCount < rule.getLimitCount();
    }
}