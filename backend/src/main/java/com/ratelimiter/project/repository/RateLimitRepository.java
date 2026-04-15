package com.ratelimiter.project.repository;

import com.ratelimiter.project.entity.RateLimitRule;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RateLimitRepository extends JpaRepository<RateLimitRule, Long> {
    Optional<RateLimitRule> findByTargetTypeAndTargetValueAndEndpoint(String targetType, String targetValue, String endpoint);
    Optional<RateLimitRule> findByTargetTypeAndEndpoint(String targetType, String endpoint);
}