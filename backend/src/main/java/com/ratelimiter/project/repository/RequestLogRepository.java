package com.ratelimiter.project.repository;

import com.ratelimiter.project.entity.RequestLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

public interface RequestLogRepository extends JpaRepository<RequestLog, Long> {
    long countByUserIdAndEndpointAndTimestampAfter(Long userId, String endpoint, LocalDateTime time);
    long countByApiKeyAndEndpointAndTimestampAfter(String apiKey, String endpoint, LocalDateTime time);
    long countByEndpointAndTimestampAfter(String endpoint, LocalDateTime time);
    long countByUserIdAndTimestampAfter(Long userId, LocalDateTime time);
    long countByUserId(Long userId);
}